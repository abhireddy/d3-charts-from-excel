# Creating shareable D3 charts from a spreadsheet
A very buggy prototype I built in 2016 that, in just a few clicks, creates visualizations from spreadsheet data that can be shared via a public URL. 

Sharing Excel charts can be awkward. Often, people upload entire workbooks to email or Slack, forcing the recipient to download and open a clunky file and then search for the relevant data. Otherwise, Excel charts get exported as images, which strip them of any interactivity. 

As an alternative, my tool allowed the user to paste their data right into the UI, using [Handsontable](https://handsontable.com/) to present a spreadsheet-like experience. The service would then generate a customizable, interactivate chart in [D3](https://d3js.org/) and provide the user with a link that could be shared via email, Slack, etc.

[Charted](https://medium.com/data-lab/introducing-charted-15161b2cd71e) is a far more polished product that solves the same use case. Try them out!
