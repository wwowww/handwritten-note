import Layout from '@components/Layout';
import CanvasRenderer from '@components/CanvasRenderer'
import PageControls from '@components/PageControls'
import ToolBar from '@components/ToolBar';

function App() {
  return (
    <Layout>
      <ToolBar />
      <CanvasRenderer />
      <PageControls />
    </Layout>
  )
}

export default App
