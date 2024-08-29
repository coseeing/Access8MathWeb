import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { LanguageIcon } from '@heroicons/react/20/solid';

import i18n, { useTranslation } from '@/lib/i18n';
import { useLocaleContext } from '@/lib/locale-switch';

const LANGUAGES = [
  { locale: 'zh-TW' },
  {
    locale: 'en',
  },
];

const LanguageMenu = () => {
  const t = useTranslation('common');
  const { changeLocale } = useLocaleContext();

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            className="flex items-center md:text-md text-base font-semibold leading-8 text-gray-900"
            aria-label={t('changeLocale')}
          >
            <LanguageIcon className="h-5 w-5 flex-none mr-1" aria-hidden="true" />
            <span>{t(`locale.${i18n.language}`)}</span>
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
                  {LANGUAGES.map(({ locale }) => (
                    <Menu.Item key={locale}>
                      {({ active }) => {
                        return (
                          <button
                            className={`group relative flex rounded-lg p-4 hover:bg-gray-50 text-gray-900 w-full ${
                              active ? 'font-bold' : 'font-normal'
                            }`}
                            onClick={() => changeLocale(locale)}
                          >
                            {t(`locale.${locale}`)}
                          </button>
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

export default LanguageMenu;
