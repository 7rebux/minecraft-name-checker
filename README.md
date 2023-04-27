# Minecraft Name Checker

Command line tool to mass scan minecraft usernames

### Features

- Input & Output files
- Invalid names filter
- Highly customizable scan algorithm
- Name claimer

### Building

```bash
git clone https://github.com/7rebux/minecraft-name-checker
cd minecraft-name-checker
pnpm i
pnpm start
```

### Acquiring Bearer Token

1. Login with your minecraft account at [minecraft.net](https://www.minecraft.net/login)
2. Navigate to your Profile
3. Open Dev Tools (`Ctrl` + `Shift` + `i`)
4. Paste this code into the console: ```console.log(`; ${document.cookie}`.split('; bearer_token=').pop().split(';').shift())```
5. The console output contains your Bearer Token