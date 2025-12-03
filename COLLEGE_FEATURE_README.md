# College Groups Feature Documentation

## Overview
The College Groups feature allows students to connect with peers from their specific college to share rides and form travel groups. This feature enhances the user experience by providing college-specific groupings through a simple dropdown menu.

## Features Implemented

### 1. College Dropdown Menu
- Accessible from the main navigation bar
- Displays a curated list of Delhi/NCR colleges
- Allows users to filter groups by their college keywords
- Includes an "Other Colleges" option for institutions not in the main list
- Responsive design for both desktop and mobile

### 2. Keyword-Based Group Filtering
- Groups are filtered based on keywords in their names that match the selected college
- For example, selecting "DTU" will show groups with "DTU" or "Delhi Technological" in their names
- The "Other Colleges" option shows groups that don't match any college keywords
- Works with the existing GroupsPage without needing separate pages

### 3. College List
The following colleges are included in the selector:
- MAIT (Maharaja Agrasen Institute of Technology)
- MSIT (Maharaja Surajmal Institute of Technology)
- GTBIT (Guru Tegh Bahadur Institute of Technology)
- ADGIPS (Akhilesh Das Gupta Institute of Technology & Management)
- NSUT (Netaji Subhas University of Technology)
- DTU (Delhi Technological University)
- IIT Delhi (Indian Institute of Technology Delhi)
- IIIT Delhi (Indraprastha Institute of Information Technology Delhi)
- BPIT (Bhagwan Parshuram Institute of Technology)
- IGDTUW (Indira Gandhi Delhi Technical University for Women)
- DU North Campus (University of Delhi North Campus)
- DU South Campus (University of Delhi South Campus)
- USAR (University School of Automation & Robotics)
- USICT (University School of Information, Communication & Technology)
- VIPS (Vivekananda Institute of Professional Studies)

## How to Use

### For Users
1. Click on the "Colleges" dropdown button in the navigation bar
2. Select your college from the list, or choose "Other Colleges" if your institution isn't listed
3. You'll be redirected to the groups page showing only groups matching your selection
4. Browse existing groups or create a new one

### For Developers
1. The feature consists of:
   - Updates to `Navbar.tsx` - Added college dropdown menu with "Other Colleges" option
   - Updates to `GroupsPage.tsx` - Added keyword-based filtering logic including "others" handling

2. To extend the college list:
   - Modify the `colleges` array in `Navbar.tsx`
   - Update the `collegeKeywords` mapping in `GroupsPage.tsx` to include relevant keywords for matching
   - Update the `allCollegeKeywords` array in `GroupsPage.tsx` for proper "others" filtering

## Technical Details

### Components
- **Navbar Integration**: Simple dropdown menu for college selection in both desktop and mobile views
- **Keyword Matching**: Groups are filtered by checking if their names contain college-specific keywords
- **"Other Colleges" Feature**: Shows groups that don't match any known college keywords

### Routing
- Uses existing `/groups` route with query parameters for college filtering
- Example: `/groups?college=dtu` for DTU-specific groups
- Example: `/groups?college=others` for other colleges

### Data Structure
- Colleges are stored as simple objects with ID and name
- Keywords for matching are defined in a mapping object in GroupsPage
- Group filtering happens client-side based on group name keywords

## Files Modified
- `src/components/Navbar.tsx` - Added college dropdown menu with "Other Colleges" option
- `src/pages/GroupsPage.tsx` - Added keyword-based filtering logic including "others" handling

## Usage Notes
- The implementation uses keyword matching in group names to filter college-specific groups
- This approach works with existing groups without requiring backend changes
- The college dropdown is designed to be easily extensible for adding more colleges
- The "Other Colleges" option provides a way for students from unlisted institutions to find relevant groups