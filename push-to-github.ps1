param(
    [switch]$SkipPush,
    [switch]$NoPrompt
)

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$historyPath = Join-Path $repoRoot "commit-history.txt"

function Get-PythonCommand {
    if (Get-Command python -ErrorAction SilentlyContinue) { return "python" }
    if (Get-Command py -ErrorAction SilentlyContinue) { return "py" }
    return $null
}

function Remove-DatePrefix {
    param(
        [string]$Text
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return ""
    }

    $value = $Text.Trim()
    $value = $value -replace '^##\s*', ''
    $value = $value -replace '^(?:\d{4}-\d{2}-\d{2}|\d{1,2}\s+[A-Za-z]+\s+\d{4}|[A-Z][a-z]+\s+\d{1,2},\s+\d{4})\s*', ''
    return $value.Trim()
}

function Get-EnglishDateText {
    $culture = [System.Globalization.CultureInfo]::GetCultureInfo("en-US")
    return (Get-Date).ToString("MMMM d, yyyy", $culture)
}

function Build-FinalCommitMessage {
    param(
        [string]$RealContent
    )

    $clean = Remove-DatePrefix -Text $RealContent
    if ([string]::IsNullOrWhiteSpace($clean)) {
        $clean = "update project"
    }

    return "## $(Get-EnglishDateText) $clean"
}

function Get-DefaultRealContent {
    return "update manufacturing_cnc-machining.md"
}

function Show-CommitDialog {
    param(
        [string[]]$History,
        [string]$DefaultMessage
    )

    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing

    $items = @($History | Select-Object -First 7)
    if ($items.Count -eq 0) {
        $items = @($DefaultMessage)
    }

    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Git Commit Message"
    $form.Size = New-Object System.Drawing.Size(700, 500)
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = "FixedDialog"
    $form.MinimizeBox = $false
    $form.MaximizeBox = $false
    $form.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Regular)
    $form.BackColor = [System.Drawing.Color]::FromArgb(245, 247, 250)

    $labelHistory = New-Object System.Windows.Forms.Label
    $labelHistory.Text = "Recent commit messages:"
    $labelHistory.Location = New-Object System.Drawing.Point(24, 22)
    $labelHistory.Size = New-Object System.Drawing.Size(220, 28)
    $labelHistory.Font = New-Object System.Drawing.Font("Segoe UI", 10.5, [System.Drawing.FontStyle]::Bold)
    $labelHistory.ForeColor = [System.Drawing.Color]::FromArgb(34, 34, 34)
    $form.Controls.Add($labelHistory)

    $combo = New-Object System.Windows.Forms.ComboBox
    $combo.Location = New-Object System.Drawing.Point(24, 52)
    $combo.Size = New-Object System.Drawing.Size(640, 30)
    $combo.Font = New-Object System.Drawing.Font("Segoe UI", 10.5, [System.Drawing.FontStyle]::Regular)
    $combo.DropDownStyle = "DropDown"
    foreach ($item in $items) {
        $combo.Items.Add($item) | Out-Null
    }
    $combo.SelectedIndex = 0
    $form.Controls.Add($combo)

    $labelEdit = New-Object System.Windows.Forms.Label
    $labelEdit.Text = "Date is added automatically. Keep only the real content here."
    $labelEdit.Location = New-Object System.Drawing.Point(24, 94)
    $labelEdit.Size = New-Object System.Drawing.Size(620, 28)
    $labelEdit.Font = New-Object System.Drawing.Font("Segoe UI", 10.5, [System.Drawing.FontStyle]::Bold)
    $labelEdit.ForeColor = [System.Drawing.Color]::FromArgb(34, 34, 34)
    $form.Controls.Add($labelEdit)

    $textBox = New-Object System.Windows.Forms.TextBox
    $textBox.Multiline = $true
    $textBox.ScrollBars = "Vertical"
    $textBox.Location = New-Object System.Drawing.Point(24, 124)
    $textBox.Size = New-Object System.Drawing.Size(640, 260)
    $textBox.Font = New-Object System.Drawing.Font("Consolas", 11, [System.Drawing.FontStyle]::Regular)
    $textBox.Text = $items[0]
    $textBox.AcceptsReturn = $true
    $textBox.AcceptsTab = $false
    $textBox.BorderStyle = "Fixed3D"
    $form.Controls.Add($textBox)

    $combo.Add_SelectedIndexChanged({
        if ($combo.SelectedItem -ne $null) {
            $textBox.Text = $combo.SelectedItem.ToString()
        }
    })

    $okButton = New-Object System.Windows.Forms.Button
    $okButton.Text = "OK"
    $okButton.DialogResult = [System.Windows.Forms.DialogResult]::OK
    $okButton.Location = New-Object System.Drawing.Point(430, 405)
    $okButton.Size = New-Object System.Drawing.Size(110, 36)
    $okButton.Font = New-Object System.Drawing.Font("Segoe UI", 10.5, [System.Drawing.FontStyle]::Bold)
    $form.Controls.Add($okButton)

    $cancelButton = New-Object System.Windows.Forms.Button
    $cancelButton.Text = "Cancel"
    $cancelButton.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
    $cancelButton.Location = New-Object System.Drawing.Point(552, 405)
    $cancelButton.Size = New-Object System.Drawing.Size(110, 36)
    $cancelButton.Font = New-Object System.Drawing.Font("Segoe UI", 10.5, [System.Drawing.FontStyle]::Regular)
    $form.Controls.Add($cancelButton)

    $form.AcceptButton = $okButton
    $form.CancelButton = $cancelButton

    $result = $form.ShowDialog()
    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        return $textBox.Text.Trim()
    }

    return $null
}

Set-Location $repoRoot

$history = @()
if (Test-Path $historyPath) {
    $history = Get-Content $historyPath | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
}

$history = $history | ForEach-Object { Remove-DatePrefix -Text $_ }
    $history = $history | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }

    $defaultMessage = $history[0]
    if ([string]::IsNullOrWhiteSpace($defaultMessage)) {
        $defaultMessage = Get-DefaultRealContent
    }

    if (-not $NoPrompt) {
        $realContent = Show-CommitDialog -History $history -DefaultMessage $defaultMessage

        if ($null -eq $realContent -or [string]::IsNullOrWhiteSpace($realContent)) {
            Write-Host "Commit cancelled."
            exit 1
        }
    } else {
        $realContent = $defaultMessage
        Write-Host "NoPrompt mode: using default commit content: $realContent"
    }

    $message = Build-FinalCommitMessage -RealContent $realContent

$pythonCmd = Get-PythonCommand
if ($pythonCmd) {
    $scriptPath = Join-Path $repoRoot "scripts\generate_page_dates.py"
    if (Test-Path $scriptPath) {
        & $pythonCmd $scriptPath
    }
}

git add .

git commit -m $message

if (-not $SkipPush) {
    git push origin main
} else {
    Write-Host "Skipping push. Commit ready: $message"
}

$normalizedRealContent = Remove-DatePrefix -Text $realContent
$uniqueHistory = @($normalizedRealContent) + @($history | Where-Object { $_ -ne $normalizedRealContent })
$uniqueHistory = $uniqueHistory | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -First 10
$uniqueHistory | Set-Content -Encoding UTF8 $historyPath

Write-Host "Saved commit history to: $historyPath"
Write-Host "Current commit message: $message"
