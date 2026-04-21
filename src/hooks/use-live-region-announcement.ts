import {useCallback, useEffect, useRef, useState} from 'react';

const ANNOUNCEMENT_DELAY_MS = 100;

// Rotate an invisible suffix so repeated live-region text is treated as a fresh announcement.
const withAnnouncementMarker = (text: string, cycle: number): string =>
    `${text}${'\u2063'.repeat((cycle % 3) + 1)}`;

const useLiveRegionAnnouncement = () => {
    const timeoutRef = useRef<number>();
    const announcementCycleRef = useRef(0);
    const usePrimarySlotRef = useRef(true);
    const [primaryAnnouncement, setPrimaryAnnouncement] = useState('');
    const [secondaryAnnouncement, setSecondaryAnnouncement] = useState('');

    const clearAnnouncement = useCallback((): void => {
        window.clearTimeout(timeoutRef.current);
        setPrimaryAnnouncement('');
        setSecondaryAnnouncement('');
    }, []);

    const announce = useCallback((text: string): void => {
        clearAnnouncement();
        timeoutRef.current = window.setTimeout(() => {
            announcementCycleRef.current += 1;
            const markedText = withAnnouncementMarker(text, announcementCycleRef.current);

            if (usePrimarySlotRef.current) {
                setPrimaryAnnouncement(markedText);
                setSecondaryAnnouncement('');
            } else {
                setPrimaryAnnouncement('');
                setSecondaryAnnouncement(markedText);
            }

            usePrimarySlotRef.current = !usePrimarySlotRef.current;
        }, ANNOUNCEMENT_DELAY_MS);
    }, [clearAnnouncement]);

    useEffect(() => {
        return () => {
            window.clearTimeout(timeoutRef.current);
        };
    }, []);

    return {
        announce,
        clearAnnouncement,
        primaryAnnouncement,
        secondaryAnnouncement,
    };
};

export default useLiveRegionAnnouncement;
