import { AnatomyDiagram } from '../AnatomyDiagram/AnatomyDiagram';
import { Tag } from './Tag';

/**
 * Anatomía de la tag (Figma · 01 Anatomía):
 * 1 container · 2 label group · 3 icon · 4 label · 5 text.
 */
export function TagAnatomy() {
  return (
    <AnatomyDiagram
      label="Anatomía de la tag: 1 container, 2 label group, 3 icon, 4 label, 5 text"
      outlines={['', '.ds-tag__group', '.ds-tag__icon', '.ds-tag__text']}
      callouts={[
        { n: 1, target: '', side: 'top', length: 40, offset: 28 },
        { n: 2, target: '.ds-tag__group', side: 'bottom', length: 42 },
        { n: 3, target: '.ds-tag__icon', side: 'left', length: 40 },
        { n: 4, target: '.ds-tag__label', side: 'top', length: 27, offset: -4 },
        { n: 5, target: '.ds-tag__text', side: 'right', length: 54 },
      ]}
    >
      <Tag size="default" status="info" label="label" text="text" />
    </AnatomyDiagram>
  );
}
