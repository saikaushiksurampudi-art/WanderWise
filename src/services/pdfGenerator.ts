import { jsPDF } from 'jspdf';
import { BookingRecord, TripPlan } from '../types';

export function generateTripPDF(trip: TripPlan, booking?: BookingRecord) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Primary Accent Header
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('WanderWise AI', 16, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(199, 210, 254);
  doc.text('Smart AI Travel Itinerary & Vouchers', 16, 28);

  // Status / Confirmation pill on header right
  const code = booking?.confirmationCode || `WWISE-${Math.floor(1000 + Math.random() * 9000)}`;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`Confirmation: ${code}`, pageWidth - 16, 20, { align: 'right' });
  doc.setFontSize(9);
  doc.setTextColor(167, 243, 208); // Emerald light
  doc.text(booking ? 'Status: BOOKED & CONFIRMED' : 'Status: PERSONALIZED DRAFT', pageWidth - 16, 28, { align: 'right' });

  // Trip Summary Card
  let y = 52;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(trip.title, 16, y);

  y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Destination: ${trip.destination}, ${trip.country}   |   Dates: ${trip.startDate} (${trip.duration} Days)   |   Travelers: ${trip.travelers}`, 16, y);

  y += 6;
  doc.text(`Interests: ${trip.interests.join(', ')}`, 16, y);

  // Budget Breakdown box
  y += 10;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(16, y, pageWidth - 32, 26, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Total Budget:', 22, y + 8);
  doc.text('Projected Total Cost:', 70, y + 8);
  doc.text('Remaining Buffer:', 130, y + 8);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`$${trip.totalBudget.toLocaleString()}`, 22, y + 18);
  doc.setTextColor(79, 70, 229);
  doc.text(`$${trip.costs.totalProjected.toLocaleString()}`, 70, y + 18);
  doc.setTextColor(16, 185, 129);
  doc.text(`$${trip.remainingBudget.toLocaleString()}`, 130, y + 18);

  // Accommodation & Transport Summary
  y += 34;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Lodging & Transportation Details', 16, y);

  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`• Hotel: ${trip.accommodation.name} (${trip.accommodation.type}) - $${trip.accommodation.totalCost} total`, 18, y);
  y += 5;
  doc.text(`  Perks: ${trip.accommodation.perks.join(' • ')}`, 18, y);
  y += 5;
  trip.transportation.forEach(t => {
    doc.text(`• ${t.type}: ${t.title} - $${t.cost} (${t.details})`, 18, y);
    y += 5;
  });

  // Day-by-Day Itinerary Table
  y += 6;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Daily Schedule & Activity Timeline', 16, y);

  y += 6;

  trip.days.forEach((day) => {
    // Check for page overflow
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(238, 242, 255);
    doc.rect(16, y, pageWidth - 32, 7, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(67, 56, 202);
    doc.text(`Day ${day.day} (${day.date}): ${day.theme} - Est. Day Total: $${day.dailyProjectedCost}`, 20, y + 5);
    y += 10;

    day.activities.forEach((act) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`[${act.timeSlot}] ${act.title}`, 20, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(79, 70, 229);
      doc.text(`$${act.totalCost} (${act.bookingType})`, pageWidth - 20, y, { align: 'right' });

      y += 4.5;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      const descLines = doc.splitTextToSize(act.description, pageWidth - 44);
      doc.text(descLines, 22, y);
      y += descLines.length * 4;

      doc.setFont('helvetica', 'italic');
      doc.setTextColor(71, 85, 105);
      const reasonLines = doc.splitTextToSize(`Why: ${act.reason}`, pageWidth - 44);
      doc.text(reasonLines, 22, y);
      y += reasonLines.length * 4 + 3;
    });

    y += 4;
  });

  // Local Tips & Hacks
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('AI Local Secrets & Travel Advice', 16, y);
  y += 7;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  trip.aiInsights.localHacks.forEach((hack) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const lines = doc.splitTextToSize(`✓ ${hack}`, pageWidth - 36);
    doc.text(lines, 18, y);
    y += lines.length * 4.5;
  });

  // Footer on last page
  y = Math.min(285, y + 10);
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated by WanderWise AI on ${new Date().toLocaleDateString()} • Safe travels!`, pageWidth / 2, y, { align: 'center' });

  // Save the PDF
  const safeFilename = `${trip.destination.replace(/[^a-zA-Z0-9]/g, '_')}_Itinerary_WanderWise.pdf`;
  doc.save(safeFilename);
}
