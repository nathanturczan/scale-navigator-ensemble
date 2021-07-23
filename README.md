# Scale Navigator Dashboard 
### (previously called scale navigator ensemble. Also thinking about re-naming to "Scale Navigator Web")
## to-do list 7-22-2021

- [ ] Re-factor everything. I think we should use React -- this will make it easier to port to mobile.
- [ ] I think index.html can be left alone for now -- doesn't need refactoring???
- [ ] sketch.js needs a complete overhaul. Some priorities:
  - responsive / mobile first design.
    - logo is size responsive, also changes color according to current scale
  - dealing with mouse clicks VS touchscreens
  - integrating Ondrej's new animated interface
  - autopilot (chooses a random scale from the list of adjescent scales every X seconds. Perhaps a slider for user to control rate of change??)
  - communication to Firebase database 
    - creating chatrooms (or "ensemble")
    - updating who is host 
    - and updating "current scale" for given chatroom
  - MIDI
    - sending MIDI data (such as root, notes, chords, etc) to local ports with Web MIDI API
  - Scale Network Visualization
  - tablature
    - render musical notation
    - render instrument tabs
    - render possible triads (chords) to play
    
    
  
## FUTURE TO - DO 
### user database
- [ ]  sign up
- [ ]  login
- [ ]  paid features vs non-paid features

### Chatrooms
- [ ]  fix what happens if duplicate rooms are created
- [ ]  deal with host switchover
- [ ]  design what "host" UI looks like
- [ ]  design what "not host" UI looks like

### TABLATURE / instruments
- [ ]  circle of major + minor triads - FIX ENHARMONIC CHORDS
- [ ]  drop-D guitar tabs
- [x]  Banjo tabs
- [x]  ukulele tabs
- [ ]  harmonica tabs
- [ ]  Add tone.js to EVERYTHING
- [ ]  Terry Riley "In C" with vexflow
- [ ]  autoharp - normal
- [x]  autoharp - custom
- [x]  fix margins
- [ ]  animate notes on instruments — opacity, size, etc

### CHORDS
- [ ]  integrate tone.js, engine for synthesis
- [ ]  Add jazz chord piano staff
- [ ]  proper accidentals

### SCALE NETWORK VISUALIZATION (3d force directed graph)
- [ ]  node group arrangements - octagon of harmonic-major to harmonic-minor, dodecagon circle of fifths, etc
- [ ]  color edges to show previously visited notes. A trail of breadcrumbs.
- [ ]  radial arrangement of neighbors around current scale
- [ ]  obscure / fade out all nodes that are not within 2 generations of current scale ()
