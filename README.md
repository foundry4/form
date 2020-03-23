# Building a public-facing form fast for NHS Ventilators


## What was needed

In the week commencing 16th March 2020, we responded to an urgent request from BEIS to build a public-facing form. The Government intends to put together a multidisciplinary team of providers that can, between them, produce the ventilators required in the response to COVID-19. The form collects information from businesses that believe they can contribute to this effort, enabling the reporting team to work out how they can be matched with nearby partners.

## What we did

We received the requirements on Monday 16th morning, published a form (https://ventilator.herokuapp.com/) on Monday 16th evening, and delivered the first data to the Cabinet Office reporting team on Wednesday 18th. By Saturday, over 2500 companies had offered their support, and we had around 100k page views within the week. We had a 3-person team of a product manager and two developers – one focused on the front end form and the other focused on the data structure and delivery. 

We used (more from what we were already working in than on purpose):

For collaboration:
- Trello
- Slack
- Google Drive
- Github

For building:
- Heroku
- Node.js/Express app (GDS Prototype kit)
- Postgres
- Fathom (analytics)
- Logentries (heroku logging tool)
- Axe Accessibility toolkit (also WAVE)
- Google Spreadsheets/Heroku Dataclips

## What we learnt & would recommend:

**Don’t forget product basics**
- For urgent requirements, you’ll often get a ‘do this’ specification
- It can be tempting to plough in, especially if it seems straightforward
- But stop and ask for the why, what’s the minimum that is useful – we didn’t get mandatory fields in straight away, and the entries in our case are useless without a contact email (or company name)
- Then you’re in a position to propose tiers of what can be done when
- Other product basics I forgot in the rush: to get a second pair of eyes on everything before it gets released

**Create some structure in the rush**
- We used Trello for task management from the first hour
- Twice daily standups allowed us to leave the dev team to it while quickly adjusting priorities
- Having stream ‘owners’ helps you know who to ask when you need quick responses; you need enough people to run parallel tasks rather than only consecutive ones, but probably not more
- Also implement an end of day tech review; we did a bit of this but probably not enough and it helps check decisions you had to make in a rush; eg for us we would’ve probably switched earlier from the prototyping kit; can be feeling productive but as we know the error rate goes up as you work faster and for longer

**Have visibility of how your application is working**
- In fast development, you will make mistakes
- You’re asked for numbers, reports etc very quickly and need to have confidence in what you’re sharing – we didn’t have this to start
- Implementing analytics gives visibility on usage, helping predict volume etc – we used Fathom which was easy to implement and doesn’t require additional user acceptance
- We’d set up heroku dataclips quicker next time, so we can be sure of the entries coming in 
- We’d set up alerts for errors faster – it can be hard to do this as they can be overwhelming but we want to know something’s gone down before users do

**Mitigate the impact of the errors you will make**
- Again, you will make mistakes, so you need to do what you can to minimise impact to users 
- Don’t skimp on an ‘under construction’ or error page showing the user how else they can provide information (phone number, email) or at least reassure them they’re not doing anything wrong and not letting them do a whole form and submitting it only for it not to work; minimises risk of lost data; heroku has an ‘under construction’ mode
- Next time we’d ensure a log drain was set up straight away to capture everything as a back up
- We’d do as we did this time and get a json copy of entries as well as the structured version; it helped us get up and running quickly with a back up
- Getting a dev environment up and running and testing releases on there hugely improved our calm and confidence, as well as the quality of what went out

**Invite and appreciate the support offered**
- Given the reasonably high profile of the project in the news, we had a decent amount of attention from the gov tech community
- Most of it was offers of help, and positive, but there was (valid) criticism in there too
- This was quite difficult for the team – already rushed off our feet – to handle
- In future we think it’d be worth proactively notifying the community on the cross-gov Slack and providing a contact for feedback, so we can handle it better
- This way it’d be less of a surprise to people, and make it a participatory experience rather than having to field comments from many directions
- In addition to that, managing other client work alongside this was incredibly challenging; you need to be available to be reactive



