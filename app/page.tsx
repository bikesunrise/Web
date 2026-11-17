import Header from '@/components/Header';
import PortadaV2 from '@/components/PortadaV2';
import './portada-v2.css';

export default function Home() {
  return (
    <>
      <Header overlay />
      <main>
        <PortadaV2 />
      </main>
    </>
  );
}
