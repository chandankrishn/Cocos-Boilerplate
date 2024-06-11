# tableView

web: unattended online.</br>
native: Unprooped online.</br>

# 优
## shortcoming
`` `
1. If you need to use a large number of labels and external pictures, you still need to do special processing (such as merging Label, etc.), Otherwise, The Stuck caused by too high dc is invitable
2. [Small disadvantages] No support and multi -row models will not be supported in the future. Users can use a single -line model mode to simulate multi -row and multi -columns (found in actual projects, multi -line and multi -row models play a very limited role.Not only is there no flexible single -line, but also greatly increases the code complexity of tableview itself))
`` `
## advantage
`` `
1. Reserve memory and CPU when a large number of cells
2. Reduce the heating problem caused by too much node
3. Make good performance of INSERT and Remove in the same frame
`` `

# API
## `` Cell: `` `
Cell's static method
`` `
@Parma Index Number Cell
@Return number cell width or height
Static Getsize (INDEX);
`` `
Cell's instance method
`` `
// Cell's initialization method, TableView will call this method when creating cell
@Parma Index Number Cell
@Parma Data Customized Data when initialized TableView
init (index, data);

// Call TableView.Reload to trigger
RELOAD (data);

// Triggered when uninstalled
uninit ();
`` `

## `` tableView: `` `
// The initialization method of tableView
`` `
The total number of @Parma Count Number Cell
@Parma Data Custom
init (count, data)
`` `

// Clear the current tableView
`` `
Clear ())
`` `

// Refresh cell
`` `
RELOAD (Start, Data);
`` `

// Insert cell
`` `
insert (start, num, data);
`` `

// Delete cell
`` `
Remove (Start, Num, Data);
`` `

// ScrollView in the Plains in the Plains
`` `
Scroltobottom (TimeinSecond, Attenuated)
scrollTotop (TimeInSecond, Attenuated)
Scroltolect (TimeInSecond, Attenuated)
ScrollTorld (TimeinSecond, Attenuated)
scrollTooffset (offset, timeInSecond, Attenuated)
GetScrolLLOFFSET ()
getmaxScrolLLLOFFSET ()
`` `

# This example