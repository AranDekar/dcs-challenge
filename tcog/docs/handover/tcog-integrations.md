# tcog integrations

Notable tcog integrations are detailed below.

#### Articles & Galleries

- The Australian
- Adelaide Now
- Daily Telegraph
- Courier Mail
- Herald Sun
- Perth Now
- news.com.au
- Fox Sports ( used only for SEO redirection of legacy urls - no rendering )
- misc ( likely to be others eg: whimn )

#### Apple News

The content integration team uses tcog to transform CAPI documents into the Apple News native JSON format. The `NewsAgent` performs these requests to tcog.

See Apple News [presentation](./presentations/Apple-News-@-news.pdf)

- [templates](http://stash.news.com.au/projects/MOBILE/repos/applenews-templates)
- [routing](http://stash.news.com.au/projects/TCOG/repos/tcog-template-router-applenews)
- [tooling](http://stash.news.com.au/projects/TCOG/repos/bugle/browse)
- [document specification](./docs/NewsAgentDocumentFormat.pdf)
- [routing specification](./docs/NewsAgentDocumentFormat.pdf)

> Point of contact : Kalvis Duckmanton

#### Integrated Sales

The integrated sales team uses tcog to support native advertising on our sites. In terms request volume it's one of tcog highest since the fragments are included on all pages ( eg: home, article, index, gallery ).

- http://a.tcog.news.com.au/component/resource/networksales/exoduscampaigns/campaigns.json?t_output=json&product=the-australian

See the following [presentation](./presentations/tcog-integrated-sales.pdf) for a high level overview.

> Point of contact : Daniel Nashokin or Penny Smith

#### PerthNow & Custodian

The PerthNow stack is special, this is due to it being divested from the business. It made sense to isolate it as eventually it will no-longer be the responsibility of NewsCorp.

Instead of requesting content directly from CAPI it uses the Custodian service. Custodian provides basic digital rights management, stripping out content PerthNow should not have access to.

More info on Custodian can be found [here](http://stash.news.com.au/projects/TCOG/repos/custodian). As of version 1.10.0 Custodian have been managed by the Kurator team.

Give Myles a heads up if you need to make changes to this stack, eg hotcode deploy.
