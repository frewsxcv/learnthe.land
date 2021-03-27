import * as React from "react";
import { hot } from "react-hot-loader";

const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";

class App extends React.Component<Record<string, unknown>, undefined> {
  public render() {
    console.log('makeRequest');
    iNaturalistApi.makeRequest();
    return (
      <div className="app">
        <h1>Hello World!</h1>
        <p>Foo to the barz</p>
        <img src={reactLogo.default} height="480" />
      </div>
    );
  }
}

const iNaturalistApi = {
  makeRequest: () => {
    const nyLng = -74.007233;
    const nyLat = 40.713051;

    const url =
      'https://api.inaturalist.org' +
        '/v1/places/nearby' +
        `?nelat=${nyLat}` +
        `&nelng=${nyLng}` +
        `&swlat=${nyLat}` +
        `&swlng=${nyLng}`;

    console.log('about to fetch');
    fetch(url).then((response) => {
      console.log(response);
    });

    /*
    const url = 'https://api.inaturalist.org/v1/observations/species_counts?captive=false&quality_grade=research&nelat=51.95442&nelng=1.53568&swlat=51.013754&swlng=-2.57869&view=species&iconic_taxa=Aves';
    */
  },
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
