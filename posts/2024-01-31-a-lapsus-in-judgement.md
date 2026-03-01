---
title: "A Lapsus$ in judgement - The sacrifice of Arion Kurtaj"
date: 2024-01-31
description: "An examination of the recent Lapsus$ cyber attacks that culminated in the indefinite hospitalisation of 18 year-old Arion Kurtaj"
tags:
  - post
  - security
  - systems
permalink: /a-lapsus-in-judgement/
og_image: /assets/og-default.png
---
As always, this website plays host to my opinions which are informed by my understanding of the facts available to me and the wisdom of the people around me. This article may be updated or amended in the event that new information comes to light.
## Introduction

With a roster of attacks against Microsoft, Uber, Samsung, Nvidia, Ubisoft, and Rockstar Games, the Lapsus$ hacker group has become infamous for it's outrageous smash and grab tactics that have impacted industry giants across the globe.

The group's members were, for a time, exclusively minors. They worked together on many majorly covered cyber offensives. The end of the story seems to be the indefinite hospital order placed on Arion Kurtaj - now turned 18, after he hacked Rockstar Games from within police protection at a Travelodge using an Amazon Firestick, a mobile phone, and the hotel TV.

The news cycle has enjoyed sharing headlines expressing awe that a teenager could hack a huge organisation using such unorthodox and limited hardware. I would like to make some space to critically reflect on the veracity of these claims, and explore whether this hack really is the MacGyver mastermind hack that it's being lauded as. Underlying this exploration will be considerations of the various structural and personal interests that might seek to oversell or 'sex up' this series of attacks from the group.

## The group

If you haven't heard of Lapsus$, here is a quick briefing on their activities: 
Lapsus$ was a hackergroup based out of Brazil and the UK that was known for 11 major cyber attacks, all of which revolved around a similar modus operandi of gaining access to a corporate network by acquiring credentials from employees. 

Once credentials were acquired, the group could begin accessing the network. Having gained access, the attack was as simple as downloading whatever they could get their hands on; deleting the files on the client-side; declaring their triumph in a 50,000 member telegram group channel; and stipulating the terms of the extortion attempts against the organisation they had successfully targeted. That's it. The reason the account of their methodology is so short is that it is simple and repeated. Lapsus$ don't really know how to pick locks, they tend to just buy the key.

The group was comprised of seven people aged between 16 - 21, with the generally recognised leader being Arion Kurtaj - who was 16 when acting most prominently in the group. Arion has since been arrested and is currently on an indefinite hospital order. An additional 7 other members have been arrested by the City of London Police. A Brazilian citizen has also been arrested under the accusation of being a member of the group.

## The process

When the group was on their first major spree in 2022, I remember learning about the straight-forward nature of their attacks. Their process of accessing, exploiting, and extorting is actually quite a simple one. Despite the simplicity of the process, it nonetheless successfully attacked global giants like Nvidia, Samsung, Ubisoft, T-Mobile, Microsoft, and Uber.

Described by [Krebs](tab:https://krebsonsecurity.com/2022/03/a-closer-look-at-the-lapsus-data-extortion-group/) as "Low tech, high impact", the Lapsus$ group employ solutions such as SIM swapping - where the attacker convinces a phone service carrier to switch a target SIM over to a new physical SIM to provide the ability to do text based multi-factor authentication. This, combined with an employees password, grants Lapsus$ access to their target network. 

They'll also happily just buy access to networks, purchasing access credentials from the internet, and also engage in plain old open recruitment on their telegram - saying they're ready to pay employees to give them access to their corporate accounts:

![A photo of the Lapsus$ recruitment telegram messages as provided by Microsoft](https://www.microsoft.com/en-us/security/blog/wp-content/uploads/2022/03/Picture1-623a2b2b62574.png)
*(Figure 1. Screenshot of an ad recruiting employees to give out access to their employer’s network from Microsoft's "DEV-0537 criminal actor targeting organisations for data exfiltration and destruction")*

The revenue stream to fund the acquisition of these access credentials is drawn from employing the same strategy on individual accounts at cryptocurrency exchanges.  The group likely use the SIM-swap method to access accounts and then drain holdings, in addition to any extortion payments made by their victims.

When access is acquired, the group don't deploy malware or ransomware - which is what sophisticated threat actors might do to secure persistent access to the network for later use. Lapsus$ instead opt for what Microsoft classifies as "Exfiltration, destruction, and extortion".  This is simply downloading everything that they can get their hands on and deleting it after the download completes. This dataset then forms the basis of their extortion attempts.

Microsoft, in their debrief on the tactics, techniques and procedures of Lapsus$, provide some interesting insights that involve light analysis on the strategy and behaviour of the group; one such insight is that there is a clear streak of apathy towards operational security or secrecy in Lapsus' ranks, with very little effort made to protect the identities or ongoing operations of the group. 

Indeed, Microsoft was actually able to stop the group from downloading source code during a live incident because Lapsus announced it to their telegram channel prematurely while the attack was ongoing.

The group also enjoyed 'embellishing' the impact of their hacks to their channels. During their attack of security service provider Okta the group created and circulated strategic screenshots to lie about the extent of the systems they've compromised.

This was the clearest indicator that the perpetrators were young and excitable, and not an advanced threat actor like a financially driven criminal organisation or state actor. The group are motivated by impressing and awing their audience, sometimes to the extent that they sabotage the entire operation by announcing it to 50,000 people halfway through it.

The intelligence was quite unanimous quite early on that Lapsus$ were a group of teenagers utilising simple methods to conduct high-impact attacks, that manage to end up sabotaging themselves with their juvenile excitement. Furthermore, they argued with one another, as teenagers tend to - with the results being that Arion had his name and address leaked by one of his peers in his cyber circles. This is the behaviour being grandiosely characterised by Microsoft, one of their prominent targets, as a "unique blend of tradecraft". 
## The response

Microsoft produced a 4,000 word incident response and threat intelligence report on the group in the wake of their hack on the company, naming Lapsus$ as the 'DEV-0537 criminal actor' or 'Strawberry Tempest' using their new weather themed threat intelligence taxonomy. They explored the group's behaviour and threats, and did their best to take Lapsus' claims to pieces. The main success for Lapsus$ came as Microsoft still allowed telephony-based MFA (recieving a text message to authenticate yourself instead of using an app like Microsoft Authenticator or Authy) and so it was with great ease that the group could exploit this using SIM swapping. 

The recommendation of avoiding using text messages for MFA was performatively publicised as guidance in the wake of the incident by Microsoft. This is a clear effort to make it appear as though we as a community are not already aware of this being best practice guidance that the giant was simply not following. Both the [National Cyber Security Centre](tab:https://www.ncsc.gov.uk/guidance/setting-2-step-verification-2sv#section_5) and the USA's [National Institute of Standards and Technology](tab:https://pages.nist.gov/800-63-3/sp800-63b.html#multifactorOTP) agree that telephony based MFA is inferior to other forms of MFA, and have done for quite a while.

It's always important to remember that anyone debriefing an incident response on their own organisation has a conflict of interest and is incentivised to make an incident appear as sophisticated as possible. To do any less is to admit the failure to prevent a simple attack succeeding. 

For clients and share holders, it's never going to be very reassuring to read a press release from a multinational conglomerate computing giant simply saying: "We still use text messages for MFA, and a 17 year old called up our SIM provider and convinced them to move one of our secure phone numbers over to a new SIM so he could log in". Instead, the profit motive will have exerted a large amount of downward pressure on Microsoft's editorialising of their debrief. To this end, the release is packed with melodramatic language and focuses on the impact of the devastating blow leveraged by the 'Strawberry Tempest' threat actor in the wake of their social engineering efforts to collect "intimate knowledge about employees, team structures, help desks, crisis response workflows, and supply chain relationships".
## The last stand

Now we're equipped with insight on the simplicity of the M.O. of Lapsus, and how their targets have been responding to their successful attempts to access their networks, we need to understand precisely how Arion conducted his infamous Rockstar Games hack. This will position us to assess how impressive it may or may not be and whether these Hollywood-esque headlines are being disingenuous. 

Firstly, Arion had access to a mobile phone - this is already enough to conduct the hack. Phones are just small computers, anything he had in addition to this will have been a bonus, but not a necessity.

If we remember the Lapsus$ calling card of purchasing or engineering access using employee credentials, Arion may have simply used existing credentials he had procured ahead of time. Alternatively, perhaps he needed to buy some and so hopped onto an access broker forum or telegram page and paid $40 for some user credentials using stolen cryptocurrency. When he did leverage his access to the network he began to download files, which is usually accomplished by right clicking and pressing download - not by 'hacking the mainframe'. When he was happy with what he had acquired, he deleted the files on Rockstar's side. Finally, Arion entered the Rockstar Slack channels to announce his hack and make his demands. It appears that no effort whatsoever was made to hide that it was him conducting the attack, or to secure the devices he was using. It's worth remembering that he was committing these digitally enabled crimes whilst in police protection and supervision.

Let's play with another theoretical - perhaps the police disabled the internet of Arion's phone and so he was left without internet in the hotel room. The Amazon Firestick is another computer left in the room with him, it's just got more controls and restrictions placed on it by Amazon. How difficult do we think it would be to remove these restrictions? This is called Jailbreaking or Rooting. It's easy.

![A youtube search for 'rooting a firestick'](https://i.imgur.com/8DURc7v.jpeg)

Thanks YouTube, looks like anywhere between 5 and 15 minutes if you don't know what you're doing. A Firestick is just running the mobile operating system Android, and reverting it back to this state allows us to install web browsers, and other tools. Perhaps Arion connected his phone via bluetooth to the Firestick to use it as a keyboard and mouse. 

There are a lot of potential ways that this final outcome of Arion being digitally empowered to conduct this hack could have occurred, and none of them are particularly outlandish in terms of raw technical skill. 

## The duty

I am left wondering why the police who have charge over a vulnerable young autistic man, who they deem to be an ongoing threat to the digital security of UK plc and it's international friends, have left him alone in a hotel room with the exact hardware he needs to perpetrate another attack. We can see the lack of interest in operational security from Arion, we can also see Arion's complete disinterest in the economic impact his hacks will have. Indeed, it is the intentions borne from this mental state that informed the decision to hold Arion in protection in a hotel. Why on earth did the police give a computer to the guy who said that he'll hack again if given access to a computer?

Arion was actually deemed unfit to stand trial due to his severe autism, and it was this same mental health assessment that determined that he 'continued to express the intent to return to cyber-crime as soon as possible'. His condition was legally recognised as affecting his decision making, to the extent that the court was directed not to assess his intentions when committing these offences, but simply whether or not he conducted the attacks. Arion has demonstrated time and time again that he may be unable to conceptualise the relationship between the actions that he is taking and the full impact of the legal consequences.

With each hack, Arion must have been releasing a huge amount of dopamine, the neurotransmitter in our brain that relates to motivation and pleasure. It is precisely this identification of the dysregulation of dopamine that is observable in autistic patients and is currently being explored by some in the neuroscience community as a corresponding trait of Autism([1](tab:https://www.jci.org/articles/view/127411), and [2](tab:https://karger.com/dne/article/39/5/355/107836/A-Dopamine-Hypothesis-of-Autism-Spectrum-Disorder)).

In this conception, dopamine may be a substance to which Arion had a dysregulated relationship - and the safeguarding effort should have protected him from the medium by which he could suffer further from that dysregulation. In effect, the failure to remove digital technology from his room is akin to leaving a harmful substance proximate and accessible to a dependant user.

If the police did leave an internet-enabled computer in the room of a soon-to-be convicted cyber criminal, despite having a duty to prevent exactly that, then perhaps they might also see the benefit in avoiding commenting on the mundane simplicity of the hack and allowing the media to present it as the improvised miracle outcome of the machinations of a savant mastermind hell-bent on causing chaos and destruction. 

There would be a very clear benefit in avoiding the conversations about whether they checked the back of the hotel telly for a Firestick, or even whether they knew that this device counted as an internet-enabled device. That would raise all sorts of questions about whether the one safeguarding job they had was carried out properly in order to protect both the potential targets from being impacted, and the perpetrator from reoffending and hurting his chances of reform. 

There is additional public interest in questioning if the training for safeguard assessments on these hotel rooms is sufficient, as not all digitally enabled crime is property damage. Police protection may apply to those engaged in harmful or violent imagery or communication, are these offenders offered the same opportunity to utilise internet enabled devices to further harm and be harmed by their behaviour? Perhaps this constitutes another reason to communicate that this incident could only occur if a technological whizz was at the helm of the event. 

##  The Incentive

The police haven't released the details on the hardware used in the Rockstar hack. Frankly they don't need to, we have enough information based on the modus operandi of Lapsus$. All computers are still computers - regardless of their shape or size. Anything with internet access can be used to enter a username and a password, or browse the internet to buy illegal access credentials. That really is all there is to this. 

It is very clearly possible to explain - with both brevity and the use of accessible language, that this was a security incident caused by a technically competent 18 year old who was using computers left in his possession to conduct a simple but high-impact attack. A considered approach, which journalists aiming to cover this story could utilise, would be to decompose the attack and contextualise it against the attackers history, as above. 

Arion is now also a legal adult and so the press are permitted to print his name in their coverage. I don't believe that the press coverage was at all informed by the investigative desire to understand or explain what happened, and this is clear in the absolute lack of technical detail or historical context shared by the press on Lapsus$' behaviour. Outfits such as The Guardian have instead clearly opted for shock value, aiming to drive traffic to their sites and generate yet more noise.

## The conclusion

This triple coincidence of wants amongst the private sector targets, the police, and the media shouldn't go unarticulated. The private sector targets need to classify the attack as sophisticated so as to minimise impact on share prices or profit. The police maintain their credibility and public image by conveying the perpetrator as a mastermind. The media stand to benefit hugely from the exposure and traffic coming from a report on the latest Hollywood-esque hack coming from a minor. Allowing these organisations to benefit from and feed on the coincidence of these interests is an obfuscation of the moral duties at hand. We need to ask what the consequences will be for this young man's life, and conclude that it is important to deconstruct these narratives when they emerge as an act of protection for people like Arion.

I hope this has adequately teased open a conversation about the finer points that may have been lost in the coverage 

Huge international organisations such as Microsoft and Rockstar that fail to take adequate steps to secure their systems against simple attacks can expect similar future incidents. Rockstar claims that the GTA 6 leak cost them $5 Million and "thousands of hours of staff time", this was almost certainly about the voluntarily incurred marketing shift they launched to reexamine their strategy after the video game clips were leaked. It's also worth mentioning that Rockstar's notorious 'crunch culture' in which employees are culturally expected to work overtime 5 days a week means that Rockstar [won't be paying for hundreds of those extra hours anyway](tab:https://www.gamerevolution.com/news/447299-rockstar-games-crunch-developer).

If we are certain then, that this is not the last teenager who will successfully break into a large organisation in this way (Arion is certainly not the first), we must make a decision. Do we engage with these incidents like has been done with Lapsus$, or do we accept our moral responsibility to people like Arion who are vulnerable and need cultural and social support.

We would do well to understand that minors are only exercising the digital skills that come as a symptom of the world built around them by the very same organisations. A holistic and informed approach to the treatment of vulnerable people, who reach out and pluck the low hanging fruits of the digital world, would prioritise helping those individuals to avoid doing so in the future. 

I am personally not bothered about bemoaning the impact of the damages to the brand of a game that lets you execute prostitutes and renames it's likeness of a Vespa to a 'Faggio'. Instead we would be better served by focusing on how we can assist the health and wellbeing of young netizens like Arion Kurtaj. Coverage of these incidents as anything other than this phenomenon is disingenuous and strips them of the advocacy and compassion that they are entitled to.

---

You can subscribe to my blog via [email](tab:https://pistolas.co.uk/subscribe) or [RSS feed](tab:https://pistolas.co.uk/feed/).

*Thank you to Eulalia Saurin, Androula Pistolas, and Elaine Haigh for your expertise, insights, and time spent on helping me produce this blog post.*
