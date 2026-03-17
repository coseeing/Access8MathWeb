import React, { useMemo } from 'react';
import { IconDots } from '@tabler/icons-react';

import { useTranslation } from '@/lib/i18n';
import Button from '@/components/core/button';
import DropdownMenu from '@/components/core/dropdown-menu';

const addonDownloadClick = () => {
  fetch('https://www.nvaccess.org/addonStore/en/all/latest.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const result = data.filter((item) => item['addonId'] === 'Access8Math');
      const link = document.createElement('a');

      link.href = result[0]['URL'];
      link.setAttribute('download', 'export.txt');

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.error('Fetch Error:', error);
    });
};

const ABOUT_ITEMS = [
  { id: 'tutorialVideo', href: 'https://tinyurl.com/Access8MathCourseRecord' },
  {
    id: 'tutorialDownload',
    href: 'https://tinyurl.com/Access8MathCourseWorkspace',
  },
  { id: 'developmentJourney', href: 'https://medium.com/p/ba30170c52ea' },
  { id: 'caseSharing', href: 'https://medium.com/p/cbf266d6f9b6' },
  {
    id: 'audiovisualReport',
    href: 'https://www.youtube.com/watch?v=11JjNgEJdrM',
  },
  {
    id: 'professionalPartnership',
    href: 'https://pr.ntnu.edu.tw/ntnunews/index.php?mode=data&id=21099',
  },
  {
    id: 'sourceCode',
    href: 'https://github.com/tsengwoody/Access8Math',
  },
];

const NativeMenu = () => {
  const t = useTranslation('menu');

  const items = useMemo(() => {
    return [
      { label: t('addonDownload'), onClick: addonDownloadClick },
      ...ABOUT_ITEMS.map((item) => ({ label: t(item.id), href: item.href })),
    ];
  }, [t]);

  return (
    <DropdownMenu
      align="right"
      triggerButton={
        <Button variant="tertiary" className="w-[88px]" aria-label={t('more')}>
          <IconDots size={16} className="flex-none mr-1" aria-hidden="true" />
          <span>{t('more')}</span>
        </Button>
      }
      items={items}
    />
  );
};

export default NativeMenu;
