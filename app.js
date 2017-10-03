require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');

const testRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

const r = new Snoowrap({
  userAgent: 'bot-myhandybot',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS
});
const client = new Snoostorm(r);

const streamOpts = {
  subreddit: 'testingground4bots',
  results: 25
};

// Create a Snoostorm CommentStream with the specified options
const comments = client.CommentStream(streamOpts);

// On comment, perform whatever logic you want to do
comments.on('comment', (comment) => {
  if(comment.body === '!createlist') {
    console.log('----------');
    console.log(JSON.stringify(comment));
    console.log('>>>>>>>>>>>>>>>');
    r.getComment(comment.parent_id)
      .fetch()
      .then(comment => comment.body)
      .then((body) => {
        const possibleUrls = body.replace(/\n/g, ' ').split(' ');

        const youtubeIds = possibleUrls.map((url) => {
          const match = url.match(testRegex);
          if (match) return match[1];
          return false;
        });

        if (youtubeIds.length) {
          const youtubeIdCSV = youtubeIds.join(',');
          comment.reply(`https://www.youtube.com/watch_videos?video_ids=${youtubeIdCSV}`);
        }  
      });
  }
});
