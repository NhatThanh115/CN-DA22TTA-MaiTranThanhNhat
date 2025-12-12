import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    let newLang = 'en';
    if (i18n.language === 'en') newLang = 'vi';
    else if (i18n.language === 'vi') newLang = 'km';
    else newLang = 'en';

    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const getLabel = () => {
    switch(i18n.language) {
      case 'vi': return 'VI';
      case 'km': return 'KM';
      default: return 'EN';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="w-4 h-4" />
      <span>{getLabel()}</span>
    </Button>
  );
}
