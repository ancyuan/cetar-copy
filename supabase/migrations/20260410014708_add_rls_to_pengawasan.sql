/*
  # Add RLS to pengawasan table

  ## Summary
  Restricts access to pengawasan data to authenticated users only.

  ## Changes
  1. Enable RLS on `pengawasan` table
  2. SELECT policy: authenticated users can read all pengawasan records
  3. INSERT policy: authenticated users can create new records
  4. UPDATE policy: authenticated users can update existing records
  5. DELETE policy: authenticated users can delete records

  ## Security
  - Only authenticated users (logged-in petugas) can access any data
  - Unauthenticated requests are completely blocked
*/

ALTER TABLE pengawasan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all pengawasan"
  ON pengawasan FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert pengawasan"
  ON pengawasan FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pengawasan"
  ON pengawasan FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pengawasan"
  ON pengawasan FOR DELETE
  TO authenticated
  USING (true);
