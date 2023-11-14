import React, { Fragment, useMemo } from 'react';
import { Transition, Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import { useTranslation } from '@/lib/i18n';

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
  { id: 'tutorialVideo', href: 'https://www.youtube.com/watch?v=E6DuuiuS6zo' },
  {
    id: 'tutorialDownload',
    href: 'https://drive.google.com/drive/folders/1fVrQjhHEypOGr3lVcqBsmk0f_u_FD1IP',
  },
  { id: 'caseSharing', href: 'https://medium.com/p/cbf266d6f9b6' },
  {
    id: 'audiovisualReport',
    href: 'https://www.youtube.com/watch?v=11JjNgEJdrM',
  },
  {
    id: 'ntnuNews',
    href: 'https://pr.ntnu.edu.tw/ntnunews/index.php?mode=data&id=21099',
  },
  {
    id: 'developmentRepository',
    href: 'https://github.com/tsengwoody/Access8Math',
  },
];

const NativeMenu = () => {
  const t = useTranslation('menu');

  const items = useMemo(() => {
    return ABOUT_ITEMS.map((item) => {
      return {
        ...item,
        name: t(item.id),
      };
    });
  }, [t]);

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            className="flex items-center md:text-xl text-base font-semibold leading-8 text-gray-900"
            aria-label={t('more')}
          >
            <span>{t('more')}</span>
            <ChevronDownIcon
              className="h-5 w-5 flex-none text-gray-400 ml-1"
              aria-hidden="true"
            />
          </Menu.Button>
          {open && <div className="fixed z-10 inset-0 bg-black opacity-30" />}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-5 flex w-screen max-w-max">
              <div className="overflow-hidden rounded-xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                <div>
                  <Menu.Item>
                    {({ active }) => {
                      return (
                        <button
                          className={`${
                            active ? 'font-bold' : 'font-normal'
                          } text-gray-900 group relative flex rounded-lg p-4 hover:bg-gray-50 w-full`}
                          onClick={addonDownloadClick}
                        >
                          {t('addonDownload')}
                        </button>
                      );
                    }}
                  </Menu.Item>

                  {items.map(({ id, name, href }) => (
                    <Menu.Item key={id}>
                      {({ active }) => {
                        return (
                          <a
                            href={href}
                            className={`${
                              active ? 'font-bold' : 'font-normal'
                            } text-gray-900 group relative flex rounded-lg p-4 hover:bg-gray-50`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {name}
                          </a>
                        );
                      }}
                    </Menu.Item>
                  ))}
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default NativeMenu;
