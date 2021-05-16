const apps = Application('System Events').applicationProcesses()

console.log(
  JSON.stringify(
    Object.values(apps)
      .filter((x) => !x.backgroundOnly())
      .map((x) => ({
        id: x.id(),
        name: x.name(),
        displayedName: x.displayedName(),
      }))
  )
)
