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
    return "## $today update project"
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
    if ($history.Count -gt 0) {
        $items = @($history | Select-Object -First 5)
        $recentText = "Recent commit messages:`n" + (($items | ForEach-Object { "  - $_" }) -join "`n")
    }

    Add-Type -AssemblyName Microsoft.VisualBasic
    $message = [Microsoft.VisualBasic.Interaction]::InputBox(
        "$recentText`n`nPress Enter to reuse the message, or type a new one.",
        "Git Commit Message",
        $defaultMessage
    )

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
