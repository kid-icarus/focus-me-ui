const initialApp = Application('System Events').applicationProcesses.where({
  frontmost: true,
})

const initialName = initialApp.name().toString()

while (true) {
  const currentApp = Application('System Events').applicationProcesses.where({
    frontmost: true,
  })
  const currentAppName = currentApp.name().toString()
  if (initialName !== currentAppName) {
    console.log(
      JSON.stringify({
        name: currentAppName,
        displayedName: currentApp.displayedName(),
      })
    )
    break
  }
  delay(0.5)
}
