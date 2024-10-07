const vscode = require('vscode');
const { spawn, exec } = require('child_process');

let serverProcess = null;
let serverPath = null;

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    console.log('Rage MP Server Controller extension activated');

    // Get the server path from the configuration
    const config = vscode.workspace.getConfiguration('ragemp');
    serverPath = config.get('serverPath');

    // Check if the server path is set
    if (!serverPath || serverPath.trim() === '') {
        // Inform the user that they need to select the server path
        vscode.window.showInformationMessage("The server path is not set. Please select the path to 'ragemp-server.exe'.");

        const selectedPath = await vscode.window.showOpenDialog({
            title: "Select Rage MP Server Executable",
            filters: {
                'Executables': ['exe']
            }
        });

        if (selectedPath && selectedPath.length > 0) {
            serverPath = selectedPath[0].fsPath;

            // Save the selected path to the configuration
            await config.update('serverPath', serverPath, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('Server path set to: ' + serverPath);
        } else {
            vscode.window.showErrorMessage('No path selected. The extension will not work without a valid server path.');
            return; // Exit if no path is selected
        }
    }

    // Extract the executable name from the server path
    const serverExecutableName = serverPath.split(/[/\\]/).pop();

    // Button to start the server
    let startButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    startButton.text = "$(play) Start Server";
    startButton.tooltip = "Start Rage MP Server";
    startButton.command = "rage-mp-server-controller-by-caballero.startServer";
    startButton.show();

    // Button to stop the server
    let stopButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    stopButton.text = "$(primitive-square) Stop Server";
    stopButton.tooltip = "Stop Rage MP Server";
    stopButton.command = "rage-mp-server-controller-by-caballero.stopServer";
    stopButton.show();

    // Button to restart the server
    let restartButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    restartButton.text = "$(sync) Restart Server";
    restartButton.tooltip = "Restart Rage MP Server";
    restartButton.command = "rage-mp-server-controller-by-caballero.restartServer";
    restartButton.show();

    // Function to check if the server process is running
    function isServerRunning(callback) {
        exec('tasklist', (err, stdout) => {
            if (err) {
                vscode.window.showErrorMessage('Failed to check running processes: ' + err.message);
                return callback(false);
            }
            // Check if the server process is in the list of running processes
            callback(stdout.toLowerCase().includes(serverExecutableName.toLowerCase()));
        });
    }

    // Command to start the server
    let startCommand = vscode.commands.registerCommand('rage-mp-server-controller-by-caballero.startServer', () => {
        isServerRunning((running) => {
            if (running) {
                vscode.window.showWarningMessage('Server is already running!');
                return;
            }

            if (!serverPath) {
                vscode.window.showErrorMessage('Server path is not set. Please set the path to the server executable first.');
                return;
            }

            serverProcess = spawn('cmd.exe', ['/c', 'start', serverPath], { cwd: 'C:\\RAGEMP\\server-files\\' });

            serverProcess.on('close', (code) => {
                console.log(`Server exited with code: ${code}`);
            });

            vscode.window.showInformationMessage('Server started in a new window!');
        });
    });

    // Command to stop the server
    let stopCommand = vscode.commands.registerCommand('rage-mp-server-controller-by-caballero.stopServer', () => {
        isServerRunning((running) => {
            if (!running) {
                vscode.window.showWarningMessage('Server is not running!');
                return;
            }

            exec(`taskkill /F /IM "${serverExecutableName}"`, (err, stdout, stderr) => {
                if (err) {
                    vscode.window.showErrorMessage('Failed to stop server: ' + stderr);
                    return;
                }

                serverProcess = null;
                vscode.window.showInformationMessage('Server stopped!');
            });
        });
    });

    // Command to restart the server
    let restartCommand = vscode.commands.registerCommand('rage-mp-server-controller-by-caballero.restartServer', () => {
        isServerRunning((running) => {
            if (running) {
                exec(`taskkill /F /IM "${serverExecutableName}"`, (err, stdout, stderr) => {
                    if (err) {
                        vscode.window.showErrorMessage('Failed to stop server: ' + stderr);
                        return;
                    }

                    startServer(); // Restart the server after stopping it
                });
            } else {
                vscode.window.showInformationMessage('Server is not running, starting it now...');
                startServer();
            }
        });
    });

    // Function to start the server (used in restart)
    function startServer() {
        serverProcess = spawn('cmd.exe', ['/c', 'start', serverPath], { cwd: 'C:\\RAGEMP\\server-files\\' });

        serverProcess.on('close', (code) => {
            console.log(`Server exited with code: ${code}`);
        });

        vscode.window.showInformationMessage('Server started in a new window!');
    }

    // Add commands and buttons to subscriptions
    context.subscriptions.push(startButton, stopButton, restartButton, startCommand, stopCommand, restartCommand);
}

function deactivate() {
    if (serverProcess) {
        exec(`taskkill /F /IM "${serverExecutableName}"`);
    }
}

module.exports = {
    activate,
    deactivate
};
