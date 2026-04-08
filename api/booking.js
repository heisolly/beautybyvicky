import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed' 
    });
  }

  try {
    const { 
      client_name, 
      email, 
      phone, 
      service_id, 
      service_name, 
      date, 
      time, 
      total_amount,
      notes 
    } = req.body;

    // Validate required fields
    if (!client_name || !email || !service_id || !date || !time) {
      return res.status(400).json({ 
        error: 'Client name, email, service, date, and time are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Check if the time slot is already booked
    const { data: existingBooking, error: checkError } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking booking:', checkError);
      return res.status(500).json({ 
        error: 'Failed to check availability' 
      });
    }

    if (existingBooking) {
      return res.status(409).json({ 
        error: 'This time slot is already booked' 
      });
    }

    // Create new booking
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          client_name,
          email,
          phone: phone || null,
          service_id,
          service_name: service_name || null,
          date,
          time,
          total_amount: total_amount || 0,
          notes: notes || null,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Failed to create booking' 
      });
    }

    // Return success response
    res.status(201).json({ 
      success: true,
      message: 'Booking created successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}
