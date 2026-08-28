import { AmbientOrbField } from './components/AmbientOrbField'
import { AppSpotlight } from './components/AppSpotlight'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { apps } from './data/apps'
import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'

function App() {
  return <div className="site-shell"><AmbientOrbField /><a className="skip-link" href="#showcase">Skip to the tools</a><Header apps={apps} /><main><Hero /><div id="showcase" className="showcase" tabIndex="-1">{apps.map((app, index) => <AppSpotlight app={app} index={index} key={app.id} />)}</div></main><Footer /></div>
}
export default App
