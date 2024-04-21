import {Application, json, urlencoded, Request, Response, NextFunction} from 'express';
import http from 'http';
import cors from 'cors';
import compression from 'compression';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import hpp from 'hpp';
import {Server} from 'socket.io';
import { createClient } from 'redis';
import Logger from 'bunyan';
import 'express-async-errors';
import {createAdapter} from '@socket.io/redis-adapter';
import { StatusCodes } from 'http-status-codes';

import {config} from '@/root/config';
import routesHandler from '@/root/routes';
import {CustomError, ErrorResponse} from '@/globals/helpers/error-handler';

const SERVER_PORT = 8080;

const log: Logger = config.createLogger('server');

export class ServerSetup  {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public start() {
        this.standardMiddleware(this.app);
        this.securityMiddleware(this.app);
        this.routeMiddleware(this.app);
        this.errorHandlerMiddleware(this.app);
        this.startServer(this.app);
    }

    private standardMiddleware(app: Application): void {
        app.use(json({limit:'50mb'}));
        app.use(compression());
        app.use(urlencoded({extended:true, limit:'50mb'}));
    }
    private securityMiddleware(app: Application): void {
        app.use(cookieSession({
            name:'session',
            keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
            secure: config.NODE_ENV!=='development',
            maxAge: 25 * 7 * 3600000
        }));
        app.use(hpp());
        app.use(helmet());
        app.use(cors({
            origin: config.CLIENT_URL,
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'PUT','OPTIONS','DELETE']
        }));
    }
    private routeMiddleware(app: Application): void {
        routesHandler(app);
    }
    private errorHandlerMiddleware(app: Application): void {
        app.all('*', (req: Request, res: Response)=>{
            return res.status(StatusCodes.NOT_FOUND).send(`${req.originalUrl} is not found`);
        });

        app.use((error: ErrorResponse, _req: Request, res: Response,next: NextFunction)=> {
            if(error instanceof CustomError) {
                return res.status(error.statusCode).json(error.serializeErrors());
            }
            next();
        });
    }
    private async startServer(app: Application): Promise<void> {
        try{
            const httpServer: http.Server = new http.Server(app);
            this.startHttpServer(httpServer);
            const io = await this.startSocketIO(httpServer);
            this.socketIOConnections(io);
        }catch(err) {
            log.error('Something went wrong', err);
        }
    }
    private async startSocketIO(httpServer: http.Server ): Promise<Server> {
        const io: Server = new Server({
            cors: {
                origin: config.CLIENT_URL!,
                methods: ['GET', 'POST', 'PUT','OPTIONS','DELETE']
            }
        });

        const pubClient = createClient({
            url: config.REDIS_HOST
        });
        const subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);

        io.adapter(createAdapter(pubClient, subClient));

        return io;
    };
    private startHttpServer(httpServer: http.Server): void {
        httpServer.listen(SERVER_PORT,()=>{
            log.info(`Server running on port ${SERVER_PORT}`);
        });
    }

    private socketIOConnections(sockerServer: Server): void {
      log.info('Socker connections');
    }
}

