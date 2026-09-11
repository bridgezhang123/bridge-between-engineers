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
    $recentText = "No history available"
    $selectedMessage = $defaultMessage

    if ($history.Count -gt 0) {
        $items = @($history | Select-Object -First 7)
        $recentText = "Recent commit messages:`n"
        for ($i = 0; $i -lt $items.Count; $i++) {
            $recentText += "  [$($i + 1)] $($items[$i])`n"
        }
        $recentText += "`nType a number (1-$($items.Count)) to reuse a recent message, or press Enter to keep the default value."
        $recentText += "`nYou can also type a new commit message directly.`n"

        $choice = [Microsoft.VisualBasic.Interaction]::InputBox(
            $recentText,
            "Choose or edit commit message",
            $defaultMessage
        )

        if ([string]::IsNullOrWhiteSpace($choice)) {
            $message = $defaultMessage
        } else {
            $trimmed = $choice.Trim()
            if ($trimmed -match '^[1-9][0-9]*$') {
                $index = [int]$trimmed - 1
                if ($index -ge 0 -and $index -lt $items.Count) {
                    $message = $items[$index]
                } else {
                    $message = $trimmed
                }
            } else {
                $message = $trimmed
            }
        }
    } else {
        $message = [Microsoft.VisualBasic.Interaction]::InputBox(
            "No history available.`n`nType a new commit message or press Enter to keep the default value.",
            "Git Commit Message",
            $defaultMessage
        )

        if ([string]::IsNullOrWhiteSpace($message)) {
            $message = $defaultMessage
        }
    }

    if ([string]::IsNullOrWhiteSpace($message)) {
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
