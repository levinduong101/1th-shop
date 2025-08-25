import TermsView from '@/src/features/terms';
import { getTerms } from '@/src/features/terms/service/get.term';

export default async function page() {
  const terms = await getTerms();

  return <TermsView terms={terms} />;
}
