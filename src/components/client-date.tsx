
"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

type ClientDateProps = {
  date: Date;
  formatString: string;
};

export function ClientDate({ date, formatString }: ClientDateProps) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // Dates are formatted on the client to avoid hydration mismatch
    setFormattedDate(format(date, formatString));
  }, [date, formatString]);

  // Render a placeholder on the server and initial client render
  if (!formattedDate) {
    return null;
  }

  return <>{formattedDate}</>;
}
