import { useTranslation } from 'react-i18next';
const formatTime = (time: number) => {
  const t = useTranslation;
  const minutes = Math.floor(time / 60);
  if (minutes > 0) return `${minutes} ${t('widget.time.minutes')}`;
  else if (minutes === 1) return `${minutes} ${t('widget.time.minute')}`;
};

export default formatTime;
