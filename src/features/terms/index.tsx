import Container from '@/src/components/ui/Container';
import { CmsPage } from './service/get.term';
import { Button } from '@/src/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

type Props = {
  terms: CmsPage | null;
};

export default function TermsView({ terms }: Props) {
  return (
    <Container className='py-5'>
      <div id='terms-page' className='mx-auto max-w-5xl rounded-lg bg-white p-10 shadow-lg'>
        <Button
          variant='white'
          className='h-10 w-10 flex-shrink-0 rounded-full border-3 !p-0'
          href='/checkout'
        >
          <ArrowLeft />
        </Button>
        <h1 className='text mt-5 text-start text-4xl font-bold'>Privacy Policy</h1>
        <div className='bg-gray my-10 h-0.5 w-full' />
        <div className='leading-[1.5]' dangerouslySetInnerHTML={{ __html: terms?.content || '' }} />
      </div>
    </Container>
  );
}
