import * as express from 'express';
import getLogger from 'dcs-logger';
import * as path from 'path';

const logger = getLogger();
const server = express();

server.use(express.static(path.join(__dirname, 'fixtures/api.newsapi.com.au/'), { maxAge: 0 }));
server.use(express.static(path.join(__dirname, 'fixtures/api.stats.foxsports.com.au/'), { maxAge: 0 }));

server.set('host', process.env.HOST || '0.0.0.0');
server.set('port', process.env.PORT || 80);

server.listen(server.get('port'), server.get('host'), () => {
 logger.debug(('  App is running at http://%s:%d in %s mode'), server.get('host'), server.get('port'), server.get('env'));
 logger.debug('  Press CTRL-C to stop\n');
});

export { server };
