import { graphicsTimeline } from '@/data/graphicsTimeline';
import { filmTimeline } from '@/data/filmTimeline';
import { gamingTimeline } from '@/data/gamingTimeline';
import { footballTimeline } from '@/data/footballTimeline';
import { gotTimeline } from '@/data/gotTimeline';
import YearScrollerEngine from '@/components/Timeline/YearScrollerEngine';
import { notFound } from 'next/navigation';

export default async function TimelinePage({ params }: { params: { id: string } }) {
  const { id } = await params;

  let timelineData;
  if (id === 'graphics-history') {
    timelineData = graphicsTimeline;
  } else if (id === 'film-history') {
    timelineData = filmTimeline;
  } else if (id === 'gaming-history') {
    timelineData = gamingTimeline;
  } else if (id === 'football-history') {
    timelineData = footballTimeline;
  } else if (id === 'got-lore') {
    timelineData = gotTimeline;
  } else {
    notFound();
  }

  return (
    <main className="w-full min-h-screen">
      <YearScrollerEngine timeline={timelineData} />
    </main>
  );
}
