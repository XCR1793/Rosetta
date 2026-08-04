; Clean up Run-at-login entries on uninstall.
; Startup is managed in-app via Settings → Open at login.
!macro customUnInstall
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Perch"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "perch"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "com.perch.app"
!macroend

; Do not force a Run key on install — that fought the in-app toggle.
!macro customInstall
!macroend
