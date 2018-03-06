Start-Process -FilePath "dotnet" -WorkingDirectory "..\Invitation.Api" -ArgumentList "run"
Start-Process -FilePath "dotnet" -WorkingDirectory "..\Invitation.Client" -ArgumentList "run"
Start-Process -FilePath "webpack" -WorkingDirectory "..\Invitation.Client\ClientApp\" -ArgumentList "-wd"