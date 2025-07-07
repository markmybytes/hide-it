<a id="readme-top"></a>


<!-- PROJECT SHIELDS -->
<div align="center">

  [![Tag][tag-shield]][tag-url]
  [![Contributors][contributors-shield]][contributors-url]
  [![Forks][forks-shield]][forks-url]
  [![Stargazers][stars-shield]][stars-url]
  [![Issues][issues-shield]][issues-url]
  [![MIT License][license-shield]][license-url]
  
</div>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">hide-it</h3>

  <p align="center">
    A vanilla javascript implementation of DataTables Responsive extension.
    <br />
    <a href="https://github.com/markmybytes/hide-it/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/markmybytes/hide-it/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>


<!-- ABOUT THE PROJECT -->
## About The Project

<p align="center">
  <img src="https://github.com/user-attachments/assets/929aeb2b-f709-496b-b421-2096f636bc80" alt="project screen shot" width="80%">
</p>


<!-- <p align="center">
  <img src="https://github.com/markmybytes/rpi-paper-eta/assets/71750702/df5b37b3-30d3-4504-87cb-6586f41e53db">
<p align="right"> -->

This project provides an alternative to DataTables's responsive plugin. JQuery is still an dependency of DataTables and 
you may not want to include JQuery into your project. _hide-it_ is completely written vanilla Javascript without any dependency to 
make your table's columns collapse when needed.

_hide-it_ is "listener safe". When a column are "collapsed" and if the cell content is an HTML node (e.g. button), the content will be **MOVED** into a collapsible menu (not clone or copy) 
so that the listener binded on the DOM node will in theory be retained.

Althought this implementation is not efficient, it maximise the chance of retain the functionality and behaviour of third party reactive library like Alpine.js or HTMX, or custom event listener.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

### Include the source
You can go to the [Releases](https://github.com/markmybytes/hide-it/releases) page the download the source and include 
the source file to your project.

```html
<link href=".../hide-it.css" rel="stylesheet">
<script src=".../hide-it.js">
```

### CDN
```html
<link href="https://cdn.jsdelivr.net/gh/markmybytes/hide-it@<version>/dist/hide-it.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/gh/markmybytes/hide-it@<version>/dist/hide-it.min.js"></script>
```

Example
```html
<!-- Specific Version -->
<link href="https://cdn.jsdelivr.net/gh/markmybytes/hide-it@0.0.1/dist/hide-it.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/gh/markmybytes/hide-it@0.0.1/dist/hide-it.min.js"></script>

<!-- Latest -->
<link href="https://cdn.jsdelivr.net/gh/markmybytes/hide-it@main/dist/hide-it.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/gh/markmybytes/hide-it@main/dist/hide-it.min.js"></script>
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

### Initialisation

To make a table "responsive", you should create an instance of `HideIt` with the CSS selector to the target table.
```javascript
const rpc = new HideIt("table");
```

Then, add the responsive class name to table headers. See [Options](#options) for the default class names.
```html
<thead>
    <tr>
        <th>ID</th>
        <th>User Name</th>
        <th class="collapse-md">Email</th>
        <th class="collapse-lg">Action</th>
    </tr>
</thead>
```

### Methods

1. `process()`

   Reparse the table. _hide-it_ will gather the necessary information and manipulate the table to make the responsive functionality wokring. 
   If new rows are added to the table, invoke this method.

2. `render()`

   Show/hide columns based on the viewport width and responsive setting to columns

3. `hiddenClasses()`

   Returns the hidden class names based on the current window width and breakpoints.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Options

_hide-it_ allows you to customise the behaviour by supplying an setting object to `HideIt`.

```javascript
  const rpc = new HideIt("table", {});
```

1. `breakpoints`
   <table>
     <tr>
       <th>Type</th>
       <td>
         <pre lang="javascript">Object&ltstring, number&gt</pre>
       </td>
      </tr>
      <tr>
        <th>Description</th>
        <td>Class names and its breakpoints (in pixel)</td>
      </tr>
      <tr>
        <th>Default</th>
        <td>
          <pre lang="javascript">
          {
            "collapse-xs": 576,
            "collapse-sm": 768,
            "collapse-md": 992,
            "collapse-lg": 1200,
            "collapse": Number.MAX_SAFE_INTEGER,
            }
          </pre>
        </td>
      </tr>
    </table>
  
3. resizeTimeout

     <table>
    <tr>
      <th>Type</th>
      <td>
        <pre lang="javascript">number</pre>
      </td>
    </tr>
    <tr>
      <th>Description</th>
      <td>Delay (in milliseconds) to rerender the table after a window resize event.</td>
    </tr>
    <tr>
      <th>Default</th>
      <td>
        150
      </td>
    </tr>
  </table>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[tag-url]: https://github.com/markmybytes/hide-it/releases
[tag-shield]: https://img.shields.io/github/v/tag/markmybytes/hide-it?style=for-the-badge&label=LATEST&color=%23B1B1B1
[contributors-shield]: https://img.shields.io/github/contributors/markmybytes/hide-it.svg?style=for-the-badge
[contributors-url]: https://github.com/markmybytes/hide-it/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/markmybytes/hide-it.svg?style=for-the-badge
[forks-url]: https://github.com/markmybytes/hide-it/network/members
[stars-shield]: https://img.shields.io/github/stars/markmybytes/hide-it.svg?style=for-the-badge
[stars-url]: https://github.com/markmybytes/hide-it/stargazers
[issues-shield]: https://img.shields.io/github/issues/markmybytes/hide-it.svg?style=for-the-badge
[issues-url]: https://github.com/markmybytes/hide-it/issues
[license-shield]: https://img.shields.io/github/license/markmybytes/hide-it.svg?style=for-the-badge
[license-url]: https://github.com/markmybytes/hide-it/blob/master/LICENSE.txt
