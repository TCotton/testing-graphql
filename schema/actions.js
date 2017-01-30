const graphql = require('graphql');
const https = require('https');
const generateSchema = require('json-to-graphql');
const fs = require('fs');

function returnDATA() {

  return new Promise((resolve, reject) => {

    return https.get({
      host: 'actioncyspecsearch.firebaseio.com',
      path: '/actions.json'
    }, (response) => {

      let body = '';

      response.on('data', function(data) {
        body += data;
      });

      response.on('end', function() {
        resolve(JSON.parse(body));
      });

    }).on('error', function(e) {
      reject('problem with request: ' + e.message);
    });

  });

}

const TODOs = [
  {
    "chanId": "facebook",
    "descr": "Lorem ipsum",
    "howToIds": [
      null,
      "howToId1",
      "howToId3"
    ],
    "imgUrl": "http://placehold.it/300x300?text=ActionScreenshot",
    "name": "Page Post Photo",
    "reqIds": [
      null,
      "reqId1",
      "reqId4"
    ],
    "url": "page-post-photo"
  },
  {
    "chanId": "twitter",
    "descr": "Lorem ipsum tweet tweet",
    "howToIds": [
      null,
      "howToId2"
    ],
    "imgUrl": "http://placehold.it/300x300?text=ActionScreenshot",
    "name": "Tweet",
    "reqIds": [
      null,
      "reqId2"
    ],
    "url": "tweet"
  },
  {
    "chanId": "facebook",
    "descr": "Lorem ipsum",
    "howToIds": [
      null,
      "howToId4"
    ],
    "imgUrl": "http://placehold.it/300x300?text=ActionScreenshot",
    "name": "Upload Video",
    "reqIds": [
      null,
      "reqId3"
    ],
    "url": "upload-video"
  }
];

const ActionsType = new graphql.GraphQLObjectType({
  name: 'actions',
  fields: function() {
    return {
      chanId: {
        type: graphql.GraphQLString
      },
      descr: {
        type: graphql.GraphQLString
      },
      imgUrl: {
        type: graphql.GraphQLString
      },
      name: {
        type: graphql.GraphQLString
      },
      url: {
        type: graphql.GraphQLString
      }
    }
  }
});

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: function() {
    return {
      actions: {
        type: new graphql.GraphQLList(ActionsType),
        resolve: function() {
          return TODOs;
        }
      }
    }
  }
});

module.exports = new graphql.GraphQLSchema({
  query: queryType
});