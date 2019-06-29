import { Request, Response, Router } from 'express';
import * as request from 'request-promise';
import * as v3toV2Story from './queries/v2tov3/methode';
import * as v3toV2Search from './queries/v2tov3/search';
import * as v3toV2Collection from './queries/v2tov3/collection';
import { port } from '../port';
import * as R from 'ramda';

const router = Router();

const sanitize = R.pickBy((v) => { return v != undefined; });

const getRequestHost = (req: Request) => { return req.hostname != '127.0.0.1' ? `${ req.hostname }` : `${ req.hostname }:${ req.connection.localPort }`; };

router.get('/content/v2/methode/:id', (req: Request, res: Response) => {
  request({
    url: `http://${ getRequestHost(req) }/graphql/v3tov2`,
    method: 'POST',
    json: {
      query: v3toV2Story.query,
      variables: {
        id: req.params['id'],
        apiKey: req.query['api_key'],
        domain: req.query['domain'],
        includeDraft: req.query['includeDraft'] == 'true',
        includeFutureDated: req.query['includeFutureDated'] == 'true',
        bustTime: req.query['bustTime'],
        documentRevisionMajor: req.query['document_revision_major'],
        documentRevisionMinor: req.query['document_revision_minor']
      }
    }
  }, function (error, response, body) {
    try {
      if (body.data.getV2) {
        return res.status(200).send(sanitize(body.data.getV2));
      } else if (body.errors) {
        const messages = R.map(R.omit(['stack']), body.errors); // omit stacktrace.

        if (R.find(R.propEq('message', 'Entity not found'))(messages)) {
          return res.status(404).send(messages);
        } else {
          return res.status(500).send(messages);
        }
      } else {
        return res.status(500).send(body);
      }
    } catch (Error) {
      res.status(500).send(body);
    }
  });
});

router.use('/content/v2/collection/:id', (req: Request, res: Response) => {
  request({
    url: `http://${ getRequestHost(req) }/graphql/v3tov2`,
    method: 'POST',
    json: {
      query: v3toV2Collection.query,
      variables: {
        id: req.params['id'],
        apiKey: req.query['api_key']
      }
    }
  }, function (error, response, body) {
    try {
      res
        .send(sanitize(body.data.getV2Collection || body.errors))
        .status(response.statusCode || 500);
    } catch (Error) {
      res
        .send(body)
        .status(500);
    }
  });
});

router.use('/content/v2/', (req: Request, res: Response) => {
  request({
    url: `http://${ getRequestHost(req)  }/graphql/v3tov2`,
    method: 'POST',
    json: {
      query: v3toV2Search.query,
      variables: {
        apiKey: req.query['api_key']
      }
    }
  }, function (error, response, body) {
    try {
      res
        .send(sanitize(body.data.getV2Search || body.errors))
        .status(response.statusCode || 500);
    } catch (Error) {
      res
        .send(body)
        .status(500);
    }
  });
});

export { router };
