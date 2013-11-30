@board_size = 3		#must be an odd number
@center_index = @board_size % 2
@player = "X" #Or maybe zeros and ones?
@board = [[]] #Two-dimensional array, 'square'


def row_win?(x, y = 0)
	return true if y == @board_size
	return false if @board[x][y] != @player

	row_win?(x, y+1)
end

def column_win?(y, x = 0)
	return true if x == @board_size
	return false if @board[x][y] != @player

	column_win?(y, x+1)
end

def diagonal_win?(x = @center_index, y = @center_index)
	return true if x < 0 || x == @board_size		#Check if we're made it off the board without a false
	return false if @board[x][y] != @player			#Check if this proves non-winning

	diagonal_win?(x+1, y+1) if x > @center_index
	diagonal_win?(x-1, y-1) if x < @center_index

	if x == @center_index
		return diagonal_win?(x+1, y+1) && diagonal_win(x-1, y-1)
	end
end


###########
# Or finish the three relevant traversals and count the number of failures
# Zero would be victory
# AI could use number of failures to determine where to place next move