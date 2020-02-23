# Immersive Horror Through Web Technologies

Recently, I published a 4 part horror story on Reddit that was fairly successful. I aimed to use web technologies to make an immersive experience that would actively engage my audience. I wanted to write a blog to share my technology choices, general informations, and lessons learned to hopefully help others build these kind of experiences. The full code for the website and all related scripts can be found here: [Operation Storefront](https://github.com/snollygolly/operation-storefront)


## Stories
Before I talk about the technical aspects of this project, here’s a link to all four parts of the stories.

- [Part 1: Did anyone else answer this ad on Reddit?](https://www.reddit.com/r/nosleep/comments/51gie2/did_anyone_else_answer_this_ad_on_reddit/)

- [Part 2: Did anyone else answer this ad on Reddit? [Part 2]](https://www.reddit.com/r/nosleep/comments/51sndi/did_anyone_else_answer_this_ad_on_reddit_part_2/)

- [Part 3: Did anyone else answer this ad on Reddit? [Part 3]](https://www.reddit.com/r/nosleep/comments/51z334/did_anyone_else_answer_this_ad_on_reddit_part_3/)

- [Part 4: Gray and Dean Research – Data Dump](https://www.reddit.com/r/nosleep/comments/524l1u/gray_and_dean_research_data_dump/)

## Concept
I’m a fan of Reddit, and one of my favorite subreddits is [/r/nosleep](https://www.reddit.com/r/nosleep/).  It’s a subreddit dedicated to horror stories, but the catch is that they have to be presented as if they were real.  The thing that keeps me coming back is reading a scary story and going “man, I wonder if that was real…”. Most stories are fairly easy to write off as fake, but I think that brief moment of doubt is really precious. I wanted to experiment with writing a story that made this moment of doubt last a bit longer than it normally would.

Since I’m a programmer, technology was critical to any plan I came up with. After thinking about it for a few days, “Operation Storefront” was born. I aimed to make a very immersive story that suspended disbelief as long as possible while entertaining and (hopefully) scaring the readers at large. I set forth to build a platform that did the following things:

- Got as close as possible to reaching out and touching the person.
  - Obviously I couldn’t travel to all the Redditors and scare them in person, so I leveraged technology to attempt to get closer to them (via phone calls, text messages, and emails).
- Build a legitimate looking website where I could direct traffic
  - The website is the lynchpin to the entire project in my opinion, so I needed a website that was secure and performant. The Reddit hug is a real thing, and I knew I’d get some moderate hacking attempts, so it needed to be buttoned up.
- Write a (somewhat) compelling story that ties what Redditors are experiencing to what they are reading.
  - I wanted most of the things that were happening to the protagonist to happen to the audience at large.

## Technologies Used
As with most of my projects, they start off with a base of [Koa Starter Kit](https://github.com/snollygolly/koa-starter). My starter kit comes with [Bootstrap](http://getbootstrap.com/), and for most projects, that’s exactly the look I want. For this project though, I decided to take a different approach. I wanted something “business-y”, and Bootstrap feels a little too modern for the company I was trying to portray. The basic website was taken from [OSWD.org](http://oswd.org/) and modified to suit my purposes and make it somewhat responsive.

I decided to use [CouchDB](http://couchdb.apache.org/) for my database for a few reasons. I was building the site as I was writing the narrative, and sometimes, one would have to be altered to fit the other. Since CouchDB is schema-less, it let me be really relaxed with the structure of my data. Also, since it’s NoSQL, SQL injection wouldn’t be something I’d have to worry about. I knew it might be getting a lot of attention, so I wanted to make sure I had most of the common attack vectors shored up.

I use sessions pretty heavily to track logged in users and progress as they complete the “experiment”. [Redis](http://redis.io/) was a natural choices for that and it performed very well.

When it came to hosting and server stuff, I’ve had overwhelmingly good luck with [Digital Ocean](https://www.digitalocean.com/). I initially set up the server at 512MB of memory, but scaled it up to 2GB when we went live. I never went above 10-15% CPU usage, and I don’t have exact stats on memory usage, but every time I looked, I had plenty free. There were times when I had 150 concurrent users, and was serving multiple requests a second, but the droplet performed well.

I was going to be serving a video through the site, so I chose [Amazon’s S3](https://aws.amazon.com/s3/) storage for that. Now, this probably wasn’t completely needed, but I didn’t want to host that large (10MB) file on my droplet for a few reasons. First, if someone wanted to DDoS, finding a large file or a slow performing endpoint would be a likely attack vector. Also, S3 lets me sign files for limited access, so the same link they used 20 minutes ago won’t work now. That being said, the video was ripped and put on YouTube on the very first day.

I wrote three scripts that were to run as cronjobs and provided much of the interactivity. Two of those scripts sent out emails using [Amazon’s SES](https://aws.amazon.com/ses/). The other used [Twilio](https://www.twilio.com/) to programmatically send out phone calls. I can’t recommend Twilio enough. If you work in [Node.js](https://nodejs.org/) and want to add telephony to your applications, Twilio is THE choice. I also manually sent out some text messages from the Twilio console when I needed to build hype.

Honestly, I never thought my series would get as big as it did. That being said, I knew it was a possibility, and I wanted to be prepared. I wanted to make sure I had high quality analytics to gauge not only popularity, but also how well the site itself was running under load. I chose [AppDynamics](https://www.appdynamics.com/) for my monitoring because it has a free 14 day trial, and that’s more than enough time for my purposes. Overall, I was fairly pleased with it, but it’s detection of errors left a lot to be desired. In addition to that, I also made sure to have [Google Analytics](https://www.google.com/analytics/) installed.

## Statistics
Below is a high level overview of some of the key statistics. Note, some of these numbers are moving targets but were accurate at the time of writing:

200 messages sent through the contact form
1900 subjects signed up
2500 emails sent
800 calls placed
1300 text messages sent
15GB of video bandwidth alone
100000 resources calls on the website
19ms average response time
85000 page views
22500 sessions
10000+ link karma
We also asked a number of “survey questions” during the course of our fake experiment. I aggregated the results and here they are:

Would you rather be a tree or a bird?

![tree-or-bird](https://user-images.githubusercontent.com/4993074/75121858-cb3de580-565d-11ea-8e93-541dcf62cd88.jpg)

Do you consider yourself a good person?

![are-you-a-good-person](https://user-images.githubusercontent.com/4993074/75121856-ca0cb880-565d-11ea-96a6-d3b7d6222b3b.jpg)

Are good people capable of bad things?

![good-people-do-bad-things](https://user-images.githubusercontent.com/4993074/75121859-cb3de580-565d-11ea-9d55-4e62eb59f426.jpg)

## Cost
The following is a breakdown of what was involved as far as costs go:

- Domain: __$10__ [Google Domains]
- Server: __$4.00__ [Digital Ocean]
- Email: __$0.23__ [Amazon SES]
- Video Bandwidth: __$1.15__ [Amazon S3]
- Phone Number: __$1.00__ [Twilio]
- Phone Calls: __$9.08__ [Twilio]
- Text Messages: __$8.87__ [Twilio]

All said and done, it cost me about __$34.33__ out of pocket.

## Summary
I believe that as far as immersive story telling in nosleep goes, this really is just the beginning. I took away a lot of lessons from building this project, and I’ve already got some great ideas for next time. I think I did a lot of things right, but I also messed up a few times. For aspiring storytellers reading this, I’d suggest paying attention to the following:

- Details!
  - Your readers will dig harder than you ever imagined them digging. Make sure you have your details straight, and keep continuity in mind.
- Play the long game.
  - No matter if it’s a Reddit account, a domain, or a business. The longer it’s been around, the more credibility you have. Plan as far in advance as you can.
- Build a person
  - If you want to make your storytelling immersive, it’s not enough to build a character, you must build a person first. Are they on social media? What kinds of things are they into? Do the things they like line up with the narrative?

## Special Thanks
Although I wrote and created this project, I had the help of a number of people along the way. I couldn’t have done it myself, and I owe any success to these people as well:

- cynical89 (for creating the video, helping with code, and generally being awesome)
- decomprosed (for writing wonderful fiction and serving as an inspiration)
- #nosleepooc on Snoonet (specifically, krstbrwn, kneeod, SearchingTheDark, TanjaSimone, ineffable, theephemera, and NuclearCorpus)
- Everyone who got involved by reading, commenting, and giving feedback. I really appreciate it.
