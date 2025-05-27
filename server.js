const cluster = require("cluster");
const os = require("os");
const chalk = require("chalk");

const PORT = process.env.PORT || 3000;
const MAX_WORKERS = os.cpus().length;
const REQUESTS_PER_WORKER = 100; // adjust this threshold as needed

if (cluster.isPrimary) {
    console.log(chalk.blue(`Primary ${process.pid} running.`));
    let workerCount = 0;
    let totalRequests = 0;

    const spawnWorker = () => {
        if (workerCount < MAX_WORKERS) {
            const worker = cluster.fork();
            workerCount++;
            console.log(chalk.green(`Spawned worker ${worker.process.pid}. Total workers: ${workerCount}`));

            // Listen for requests from workers
            worker.on('message', (msg) => {
                if (msg.type === 'request') {
                    totalRequests++;
                    if (totalRequests % REQUESTS_PER_WORKER === 0) {
                        spawnWorker();
                    }
                }
            });
        }
    };

    // Start with a single worker
    spawnWorker();

    cluster.on("exit", (worker) => {
        console.log(chalk.yellow(`Worker ${worker.process.pid} exited. Restarting...`));
        workerCount--;
        spawnWorker();
    });

} else {
    const app = require("./src/app");

    app.use((req, res, next) => {
        if (process.send) {
            process.send({ type: 'request' });
        }
        next();
    });

    app.listen(PORT, () => {
        console.log(chalk.green(`Worker ${process.pid} running on port ${PORT}.`));
    });
}
