// Component props
import { ScrollShadow } from '@nextui-org/scroll-shadow';

interface PageSectionLayoutProps {
  header: string;
  children?: React.ReactNode;
}

/**
 * Layout for a section of scrollable content on a page with a header
 *
 * @param {string} header - Text to display at the top of the section
 * @param {React.ReactNode} children - The content to display in the section
 */
const PageSectionLayout = ({ header, children }: Readonly<PageSectionLayoutProps>) => {
  return (
    <div className="flex flex-col mx-2 flex-1 rounded-xl shadow-xl bg-white">
      <h1 className="flex-shrink px-2 pt-2 text-2xl font-bold">{ header }</h1>
      <ScrollShadow hideScrollBar size={ 100 } className="flex-1 overflow-y-auto max-h-screen">
        { children }
      </ScrollShadow>
    </div>
  );
};

export default PageSectionLayout;