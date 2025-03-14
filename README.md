# YouTube 5-Minute Slideshow Blocker

**YouTube 5-Minute Slideshow Blocker** is a Chrome extension that forces you to wait and remain active for 5 minutes before playing any YouTube video. During these 5 minutes, a slideshow (with user-provided images) is displayed, accompanied by a timer. If you are inactive for more than 10 seconds at a stretch, the countdown is paused until you move the mouse, click, or press any key on the keyboard again. Once 5 minutes of active time passes, the overlay disappears and the YouTube video starts playing.

## Table of Contents

- [YouTube 5-Minute Slideshow Blocker](#youtube-5-minute-slideshow-blocker)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Project Structure](#project-structure)
    - [Description of Key Files](#description-of-key-files)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Customization / Options Page](#customization--options-page)
  - [Technical Details](#technical-details)
  - [Known Limitations](#known-limitations)
  - [Contributing](#contributing)
  - [License](#license)

---

## Features

1. **Slideshow Overlay**  
   - Displays images in a loop on top of the YouTube page.  
   - Cycle slides every 5 seconds (this can be changed in the code).

2. **5-Minute Timer**  
   - Counts down from 300 seconds (5 minutes).  
   - Pauses if you remain inactive for more than 10 seconds.

3. **Forced Pause on Video**  
   - Video is automatically paused at the start.  
   - Only resumes after the countdown completes.

4. **Content Script & Options Page**  
   - Content script inserts and manages the overlay on YouTube watch pages.  
   - Options page allows you to add or remove images for the slideshow.

---

## Project Structure

```
YouTube-5-minute-slideshow-blocker/
│
├── manifest.json          # Main manifest (Manifest V3)
├── background.js          # (Optional) Used if you need event-based background scripts
├── content-script.js      # Core logic that runs on YouTube watch pages
├── options.html           # Extension options page (UI for managing slideshow images)
├── options.js             # Logic for handling the options page
├── slideshow.css          # Styles used by the slideshow overlay
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

### Description of Key Files

- **manifest.json**  
  Defines the extension’s name, permissions, content scripts, icons, etc.

- **content-script.js**  
  Injected on YouTube watch pages (`*://www.youtube.com/watch*`, `*://www.youtube.com/shorts*`). Creates and manages the slideshow overlay, counts down 5 minutes, monitors user activity, and resumes the video at the end.

- **options.html** and **options.js**  
  Provide an interface for users to configure the extension. Specifically, users can add or remove image URLs for the slideshow.

- **slideshow.css**  
  Contains styles to make the overlay, slides, and timer look presentable and stand out over the YouTube player.

- **icons/**  
  Contains icon resources for the extension displayed in Chrome’s toolbar or extension manager.

---

## Installation

1. **Clone or Download this Repository**  
   ```bash
   git clone https://github.com/szunaj13pl/YouTube-5-minute-slideshow-blocker.git
   ```
   Or download the ZIP and extract it.

2. **Open Google Chrome** and navigate to:
   ```
   chrome://extensions
   ```

3. **Enable Developer Mode**  
   - In the top right corner (or left, depending on Chrome version), toggle **Developer mode** on.

4. **Load Unpacked Extension**  
   - Click **Load unpacked** (or **Load Unpacked Extension**).
   - Select the `YouTube-5-minute-slideshow-blocker/` folder that contains the manifest.json file.

5. **Verify Installation**  
   - The extension should appear in the list with its icon and name.  
   - Pin it if desired so you can easily access extension info from the Chrome toolbar.

---

## Usage

1. **Navigate to a YouTube Video** (any URL such as `https://www.youtube.com/watch?v=xyz` or `https://www.youtube.com/shorts/xyz`).  
2. **Slideshow Overlay Appears**  
   - You’ll see a dark overlay with a slideshow of images, a timer, and an inactivity warning that appears if you stop interacting for 10 seconds.
3. **Remain Active for 5 Minutes**  
   - Move the mouse, click, or press keys to keep the countdown going.
   - If you remain inactive for more than 10 seconds, the timer pauses.
4. **Video Resumes**  
   - After 5 minutes of active time, the overlay disappears and the YouTube video starts playing.

---

## Customization / Options Page

You can load your own images into the slideshow:

1. **Go to Chrome Extensions**:
   ```
   chrome://extensions
   ```
2. **Locate “YouTube 5-Minute Slideshow Blocker”**  
   - Click the “Details” button or “Options” link.
3. **Add Image URLs**  
   - Paste the direct image URL (https://...) into the text box.  
   - Click “Add” to store it.  
4. **Delete or Edit Existing Image Paths**  
   - Use the “Remove” button to delete any images you no longer want.

If you don’t add any images, a default message (“No images in slideshow...”) will appear on the overlay.

---

## Technical Details

- **Manifest V3**  
  The project is built using Chrome Manifest V3, ensuring compliance with the latest guidelines for Chrome extensions.

- **Content Script**  
  The main logic is implemented in `content-script.js`, which:  
  - Inserts a `<div>` overlay with a slideshow.  
  - Pauses any YouTube video via `document.querySelector('video').pause()`.  
  - Tracks user activity with event listeners on `mousemove`, `keydown`, `click`.  
  - Resumes the video once the 5-minute timer completes.

- **Storage**  
  The extension uses `chrome.storage.sync` to persist the list of image URLs so that your slideshow settings are retained across sessions (and can potentially sync if you’re logged into Chrome).

---

## Known Limitations

1. **YouTube Behavior**  
   - In rare cases, YouTube might auto-resume the video. We attempt to pause repeatedly until the timer finishes, but certain reloading or ads might cause unexpected behavior.

2. **No Network Connection**  
   - If image URLs load slowly or are offline, the slideshow may display blank images.

3. **Single Timer**  
   - The 5-minute timer is universal. If you open multiple YouTube tabs, each tab uses its own overlay and timer instance.

4. **Only for YouTube Watch Pages**  
   - The extension currently only matches URLs containing `youtube.com/watch` and `youtube.com/shorts`. It won’t activate on channel pages or other sections of YouTube.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository  
2. Create a new branch (e.g., `feature/add-new-animation`)  
3. Commit and push your changes  
4. Open a Pull Request describing the changes you made

Please ensure your contributions are well-tested and documented.

---

## License

[MIT License](LICENSE)

---

<p align="center">
  <b>Enjoy your productivity boost and limit those YouTube distractions!</b>
</p>
