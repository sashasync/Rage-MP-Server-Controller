# Rage MP Server Controller

This extension allows you to easily manage your local Rage MP server directly from Visual Studio Code. With this extension, you can start, stop, and restart your server with just a click, all from the status bar.

**Made by Caballero**

## Features

- **Start Server**: Launch your Rage MP server from VS Code.
- **Stop Server**: Terminate the server process when you're done.
- **Restart Server**: Quickly restart your server without manually stopping and starting it.
- **Path Configuration**: Set the path to your `ragemp-server.exe` easily.
- **Status Notifications**: Get real-time notifications on server status and actions.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
3. Search for "Rage MP Server Controller" and click Install.

Alternatively, you can install the `.vsix` package directly if you've downloaded it.

## Configuration

### Set Server Path

On first launch, you will be prompted to set the path to your `ragemp-server.exe`. If the path is not set, you will receive a notification to select the executable.

## Usage

Once the extension is installed and the path is configured, you will see three buttons in the status bar:

- **Start Server**: Click to start the server.
- **Stop Server**: Click to stop the running server.
- **Restart Server**: Click to restart the server.

### Notifications

You will receive notifications for various actions, including:

- Server started
- Server stopped
- Server is not running (when trying to restart)

## Troubleshooting

- **Server does not start**: Ensure the correct path to `ragemp-server.exe` is set in the extension settings.
- **Cannot stop server**: Make sure the server is running before trying to stop it.

## Contributing

If you would like to contribute to this extension, please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Thanks to the community for their support and contributions!

---
