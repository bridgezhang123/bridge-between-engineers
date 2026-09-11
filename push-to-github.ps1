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

function Get-DefaultCommitMessage {
    $today = Get-Date -Format "yyyy-MM-dd"
    return "## $today update manufacturing_cnc-machining.md"
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
    $form.Size = New-Object System.Drawing.Size(620, 420)
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = "FixedDialog"
    $form.MinimizeBox = $false
    $form.MaximizeBox = $false

    $labelHistory = New-Object System.Windows.Forms.Label
    $labelHistory.Text = "Recent commit messages:"
    $labelHistory.Location = New-Object System.Drawing.Point(20, 20)
    $labelHistory.Size = New-Object System.Drawing.Size(200, 24)
    $form.Controls.Add($labelHistory)

    $combo = New-Object System.Windows.Forms.ComboBox
    $combo.Location = New-Object System.Drawing.Point(20, 45)
    $combo.Size = New-Object System.Drawing.Size(560, 26)
    $combo.DropDownStyle = "DropDown"
    foreach ($item in $items) {
        $combo.Items.Add($item) | Out-Null
    }
    $combo.SelectedIndex = 0
    $form.Controls.Add($combo)

    $labelEdit = New-Object System.Windows.Forms.Label
    $labelEdit.Text = "Edit commit message before submitting:"
    $labelEdit.Location = New-Object System.Drawing.Point(20, 90)
    $labelEdit.Size = New-Object System.Drawing.Size(260, 24)
    $form.Controls.Add($labelEdit)

    $textBox = New-Object System.Windows.Forms.TextBox
    $textBox.Multiline = $true
    $textBox.ScrollBars = "Vertical"
    $textBox.Location = New-Object System.Drawing.Point(20, 115)
    $textBox.Size = New-Object System.Drawing.Size(560, 190)
    $textBox.Text = $items[0]
    $form.Controls.Add($textBox)

    $combo.Add_SelectedIndexChanged({
        if ($combo.SelectedItem -ne $null) {
            $textBox.Text = $combo.SelectedItem.ToString()
        }
    })

    $okButton = New-Object System.Windows.Forms.Button
    $okButton.Text = "OK"
    $okButton.DialogResult = [System.Windows.Forms.DialogResult]::OK
    $okButton.Location = New-Object System.Drawing.Point(355, 325)
    $okButton.Size = New-Object System.Drawing.Size(100, 30)
    $form.Controls.Add($okButton)

    $cancelButton = New-Object System.Windows.Forms.Button
    $cancelButton.Text = "Cancel"
    $cancelButton.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
    $cancelButton.Location = New-Object System.Drawing.Point(470, 325)
    $cancelButton.Size = New-Object System.Drawing.Size(100, 30)
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

$defaultMessage = $history[0]
if ([string]::IsNullOrWhiteSpace($defaultMessage)) {
    $defaultMessage = Get-DefaultCommitMessage
}

if (-not $NoPrompt) {
    $message = Show-CommitDialog -History $history -DefaultMessage $defaultMessage

    if ($null -eq $message -or [string]::IsNullOrWhiteSpace($message)) {
        Write-Host "Commit cancelled."
        exit 1
    }
} else {
    $message = $defaultMessage
    Write-Host "NoPrompt mode: using default commit message: $message"
}

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

$uniqueHistory = @($message) + @($history | Where-Object { $_ -ne $message })
$uniqueHistory = $uniqueHistory | Select-Object -First 10
$uniqueHistory | Set-Content -Encoding UTF8 $historyPath

Write-Host "Saved commit message history to: $historyPath"
Write-Host "Current commit message: $message"
