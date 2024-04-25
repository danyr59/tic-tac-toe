CXX = g++ -std=c++17
WARN = -Wall -Wextra -Wcast-align -Wno-sign-compare -Wno-write-strings -Wno-parentheses -Wno-invalid-source-encoding
FLAGS =  -pthread  -DDEBUG -D_GLIBCXX__PTHREADS -g -O0 $(WARN) 

server: client
	$(CXX) $(FLAGS) $(INCLUDE) $@.cpp -o $@

client:
	$(CXX) $(FLAGS) $(INCLUDE) $@.cpp -o $@