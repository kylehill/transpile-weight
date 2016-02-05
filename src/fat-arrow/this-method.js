var x = {
	a: "x",
	b: function() { 
		return () => { return this.a } 
	}
}