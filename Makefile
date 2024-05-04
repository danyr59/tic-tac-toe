CXX = g++ -std=c++17
WARN = -Wall -Wextra -Wcast-align -Wno-sign-compare -Wno-write-strings -Wno-parentheses -Wno-invalid-source-encoding
FLAGS =  -pthread  -DDEBUG -D_GLIBCXX__PTHREADS -g -O0 $(WARN) 
LIBLINK = -lpthread 
main: server.o
	$(CXX) $(FLAGS) $(INCLUDE) $< $@.cpp -o $@.out

%.o: %.cpp
	$(CXX) $(FLAGS) $(INCLUDE) -c $< -o $@ $(LIBLINK)

clean:
	rm *.out *.o