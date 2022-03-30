import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/header/Header';
import Showcase from './components/showcase/Showcase';
import LocationList from './components/locationList/LocationList';
import Location from './pages/location/Location';
import AboutPage from './pages/aboutPage/AboutPage';
import NotFound from './pages/notFound/NotFound';
import Error from './components/error/Error';
import Footer from './components/footer/Footer';

/**
 * Ajout de tous les imports pour le rendu final, mais pendants les test, supression des imports superflus
 * si tous les imports sont présents lors des tests, il apparaitra seulement le message d'erreur indiquant qu'il manque des fichiers dans le directory
 * donc je mets les imports concernés en commentaire avec /** */


class App extends React.Component {    /**empêche de chargement de tous les props au lancement, pour n'afficher que les props concernés par la page affichée */
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };

    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.setState({ isLoaded: false });
    fetch('/logements.json')
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          isLoaded: true,
          items: result,
        });
      })
      .catch((error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      });
  }

  render() {
    if (this.state.error !== null) {
      return <Error />;
    }

    return (        /**définit la partie router, donc la partie ici qui va créer des URL adaptés aux pages*/
      <Router>
        <Header />
        <main className="main">
          <Switch>
            <Route exact path="/">
              <Showcase title="Chez vous, partout et ailleurs" />
              <LocationList locations={this.state.items} />
            </Route>
            <Route
              path="/location/:id"
              render={(props) => (
                <Location
                  id={props.match.params.id}
                  locations={this.state.items}
                  isLoaded={this.state.isLoaded}
                  {...props}
                />
              )}
            />
            <Route path="/about">
              <AboutPage />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </main>
        <Footer />
      </Router>
    );
  }
}

export default App;
