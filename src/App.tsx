import Layout from '@components/Layout';
import CanvasRenderer from '@components/CanvasRenderer'
import ToolBar from '@components/ToolBar';

function App() {
  return (
    <Layout>
      <ToolBar />
      <CanvasRenderer />
    </Layout>
  )
}

export default App
