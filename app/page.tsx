// Fetch real live events from Supabase via our API route
  useEffect(() => {
    if (!live) return;

    const fetchLiveEvents = async () => {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        const data = await res.json();
        if (data?.events && data.events.length > 0) {
          setEvents(data.events);
        }
      } catch (e) {
        // Fallback silently if offline or database is empty
      }
    };

    fetchLiveEvents();
    const interval = setInterval(fetchLiveEvents, 2500);
    return () => clearInterval(interval);
  }, [live]);
