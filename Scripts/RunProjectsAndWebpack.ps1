Start-Process -WorkingDirectory "..\Invitation.Api" -FilePath "dotnet" -ArgumentList "watch run"
Start-Process -WorkingDirectory "..\Invitation.Client" -FilePath "dotnet" -ArgumentList "run"
Start-Process -WorkingDirectory "..\Invitation.Client\ClientApp\" -FilePath "webpack" -ArgumentList "-wd"
Start-Process -WorkingDirectory "..\Invitation.Client\ClientApp\" -FilePath "jest" -ArgumentList "--watchAll"