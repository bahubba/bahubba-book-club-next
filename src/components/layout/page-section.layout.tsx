// Component props
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Button } from '@nextui-org/button';
import PlusIcon from '@/components/icons/plus.icon';
import SectionHeaderLayout from '@/components/layout/section-header.layout';

interface PageSectionLayoutProps {
  header: string;
  sectionHeaderChildren?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Layout for a section of scrollable content on a page with a header
 *
 * @param {PageSectionLayoutProps} props
 * @param {string} props.header - Text to display at the top of the section
 * @param {React.ReactNode} props.sectionHeaderChildren - The content to display in the hidden hover div of the header
 * @param {React.ReactNode} props.children - The content to display in the section
 */
const PageSectionLayout = ({ header, sectionHeaderChildren, children }: Readonly<PageSectionLayoutProps>) =>
  <div className="flex flex-col mx-2 flex-1 rounded-xl shadow-xl bg-white">
    <SectionHeaderLayout title={ header }>
      { sectionHeaderChildren }
    </SectionHeaderLayout>
    <ScrollShadow hideScrollBar size={ 100 } className="flex-1 overflow-y-auto max-h-screen">
      { children }
    </ScrollShadow>
  </div>;

export default PageSectionLayout;